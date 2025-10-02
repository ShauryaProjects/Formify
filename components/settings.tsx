"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AvatarCrop } from "@/components/ui/avatar-crop"
import { ConfirmationModal } from "@/components/ui/confirmation-modal"
import { User, Camera, Phone, Trash2 } from "lucide-react"
import { auth, storage, db } from "@/firebase"
import { onAuthStateChanged, updateProfile, deleteUser, type User as FirebaseUser } from "firebase/auth"
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface UserProfile {
  displayName: string
  phoneNumber?: string
  avatarUrl?: string
}

export default function Settings() {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null)
  const [profile, setProfile] = useState<UserProfile>({
    displayName: "",
    phoneNumber: "",
    avatarUrl: ""
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)
  const [showAvatarCrop, setShowAvatarCrop] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [tempImageUrl, setTempImageUrl] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)
  const [tempDisplayName, setTempDisplayName] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user)
        await loadUserProfile(user.uid)
      } else {
        router.push("/login")
      }
    })
    return () => unsub()
  }, [router])

  const loadUserProfile = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, "users", uid))
      if (userDoc.exists()) {
        const userData = userDoc.data()
        setProfile({
          displayName: userData.displayName || "",
          phoneNumber: userData.phoneNumber || "",
          avatarUrl: userData.avatarUrl || ""
        })
      } else {
        // Create user document if it doesn't exist
        setProfile({
          displayName: currentUser?.displayName || "",
          phoneNumber: "",
          avatarUrl: ""
        })
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      // Don't show error toast for offline scenarios, just use default values
      setProfile({
        displayName: currentUser?.displayName || "",
        phoneNumber: "",
        avatarUrl: ""
      })
    }
  }

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string
      setTempImageUrl(imageUrl)
      setShowAvatarCrop(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropComplete = async (croppedImageUrl: string) => {
    if (!currentUser) return

    try {
      setIsLoading(true)
      
      // Convert data URL to blob
      const response = await fetch(croppedImageUrl)
      const blob = await response.blob()
      
      // Upload to Firebase Storage
      const avatarRef = ref(storage, `avatars/${currentUser.uid}`)
      await uploadBytes(avatarRef, blob)
      const downloadURL = await getDownloadURL(avatarRef)
      
      // Update user profile
      await updateProfile(currentUser, {
        photoURL: downloadURL
      })
      
      // Update Firestore
      await updateDoc(doc(db, "users", currentUser.uid), {
        avatarUrl: downloadURL
      })
      
      setProfile(prev => ({ ...prev, avatarUrl: downloadURL }))
      setShowAvatarCrop(false)
      setTempImageUrl("")
      toast.success("Avatar updated successfully!")
      
    } catch (error) {
      console.error("Error updating avatar:", error)
      toast.error("Failed to update avatar")
    } finally {
      setIsLoading(false)
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTempDisplayName(e.target.value)
  }

  const handleStartEditName = () => {
    setTempDisplayName(profile.displayName)
    setIsEditingName(true)
  }

  const handleCancelEditName = () => {
    setTempDisplayName("")
    setIsEditingName(false)
  }

  const handleSaveName = async () => {
    if (!currentUser) {
      toast.error("User not authenticated")
      return
    }

    if (!tempDisplayName.trim()) {
      toast.error("Display name cannot be empty")
      return
    }

    try {
      setIsSavingName(true)

      // Update Firebase Auth profile
      await updateProfile(currentUser, {
        displayName: tempDisplayName.trim()
      })

      // Update Firestore (with error handling for offline scenarios)
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          displayName: tempDisplayName.trim()
        })
      } catch (firestoreError) {
        console.warn("Firestore update failed, but Auth profile updated:", firestoreError)
      }

      // Update local state
      setProfile(prev => ({ ...prev, displayName: tempDisplayName.trim() }))
      setIsEditingName(false)
      setTempDisplayName("")
      toast.success("Name updated successfully!")
      
    } catch (error) {
      console.error("Error updating name:", error)
      toast.error("Failed to update name")
    } finally {
      setIsSavingName(false)
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))
  }

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(phone.replace(/\s/g, ""))
  }


  const handleDeleteAccount = async () => {
    if (!currentUser) return

    try {
      setIsLoading(true)

      // Delete user's avatar from storage if exists
      if (profile.avatarUrl) {
        try {
          const avatarRef = ref(storage, `avatars/${currentUser.uid}`)
          await deleteObject(avatarRef)
        } catch (error) {
          console.warn("Error deleting avatar:", error)
        }
      }

      // Delete user document from Firestore
      await deleteDoc(doc(db, "users", currentUser.uid))

      // Delete user account
      await deleteUser(currentUser)

      toast.success("Account deleted successfully")
      router.push("/")
      
    } catch (error) {
      console.error("Error deleting account:", error)
      toast.error("Failed to delete account")
    } finally {
      setIsLoading(false)
      setShowDeleteModal(false)
    }
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto mt-4">
      {/* Profile Section */}
      <Card className="rounded-2xl border-black/10 p-4 shadow-sm">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full bg-black/10 flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-6 w-6 text-black/40" />
              )}
            </div>
            <button
              onClick={handleAvatarClick}
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-black text-white flex items-center justify-center hover:bg-black/90 transition-colors"
              disabled={isLoading}
            >
              <Camera className="h-2.5 w-2.5" />
            </button>
          </div>
          <div>
            <h3 className="text-base font-semibold">
              {profile.displayName || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Profile Picture'}
            </h3>
            <p className="text-xs text-black/60">Click the camera icon to upload a new avatar</p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </Card>

      {/* Personal Information */}
      <Card className="rounded-2xl border-black/10 p-4 shadow-sm">
        <h3 className="text-base font-semibold mb-3">Personal Information</h3>
        
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="displayName"
                  value={isEditingName ? tempDisplayName : profile.displayName}
                  onChange={handleNameChange}
                  placeholder={isEditingName ? "Enter your display name" : profile.displayName || "Enter your display name"}
                  disabled={!isEditingName}
                  className={`border-black/20 bg-white/70 focus:border-black/30 ${!isEditingName ? 'cursor-not-allowed' : ''}`}
                />
                {!isEditingName ? (
                  <Button
                    type="button"
                    onClick={handleStartEditName}
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                  >
                    Change Name
                  </Button>
                ) : (
                  <div className="flex gap-1 shrink-0">
                    <Button
                      type="button"
                      onClick={handleSaveName}
                      size="sm"
                      disabled={isSavingName || !tempDisplayName.trim()}
                      className="bg-black text-white hover:bg-black/90"
                    >
                      {isSavingName ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      type="button"
                      onClick={handleCancelEditName}
                      variant="outline"
                      size="sm"
                      disabled={isSavingName}
                      className="hover:bg-red-50 hover:text-red-700 hover:border-red-300"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number (Optional)</Label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40" />
                  <Input
                    id="phoneNumber"
                    value={profile.phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="+1 (555) 123-4567"
                    className="pl-10 border-black/20 bg-white/70 focus:border-black/30"
                  />
                </div>
                <Button
                  type="button"
                  onClick={() => {
                    // Add phone number linking functionality here
                    toast.success("Phone number linking feature coming soon!")
                  }}
                  variant="outline"
                  size="sm"
                  className="shrink-0"
                >
                  Link Number
                </Button>
              </div>
              {profile.phoneNumber && !validatePhoneNumber(profile.phoneNumber) && (
                <p className="text-xs text-red-600">Please enter a valid phone number</p>
              )}
            </div>
          </div>

        </div>
      </Card>

      {/* Danger Zone */}
      <Card className="rounded-2xl border-red-200 p-4 shadow-sm bg-red-50/50">
        <h3 className="text-base font-semibold text-red-800 mb-2">Danger Zone</h3>
        <p className="text-xs text-red-600 mb-3">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        
        <Button
          variant="destructive"
          onClick={() => setShowDeleteModal(true)}
          size="sm"
          className="bg-red-600 hover:bg-red-700 w-fit"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Delete Account
        </Button>
      </Card>

      {/* Avatar Crop Modal */}
      {showAvatarCrop && (
        <AvatarCrop
          imageUrl={tempImageUrl}
          onCrop={handleCropComplete}
          onCancel={() => {
            setShowAvatarCrop(false)
            setTempImageUrl("")
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        title="Delete Account"
        description="This action is permanent. All your data, forms, and submissions will be permanently deleted and cannot be recovered."
        confirmText="Delete Account"
        confirmationPhrase="delete my account"
        variant="destructive"
        isLoading={isLoading}
      />
    </div>
  )
}
