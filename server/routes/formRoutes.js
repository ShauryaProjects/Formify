const express = require("express")
const router = express.Router()
const Form = require("../models/Form")

// POST /api/forms - Create a new form
router.post("/", async (req, res) => {
  try {
    const { title, description, steps, createdBy } = req.body

    if (!title || !steps || steps.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and at least one step are required",
      })
    }

    const form = new Form({
      title,
      description,
      steps,
      createdBy: createdBy || "anonymous",
    })

    await form.save()

    const sharableLink = `${process.env.FRONTEND_URL || "http://localhost:3000"}/form/${form._id}`

    res.status(201).json({
      success: true,
      data: {
        formId: form._id,
        sharableLink,
        form,
      },
      message: "Form created successfully",
    })
  } catch (error) {
    console.error("Error creating form:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create form",
      error: error.message,
    })
  }
})

// GET /api/forms/:formId - Get form schema
router.get("/:formId", async (req, res) => {
  try {
    const { formId } = req.params

    const form = await Form.findById(formId)

    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      })
    }

    res.json({
      success: true,
      data: form,
      message: "Form retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching form:", error)

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Invalid form ID",
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch form",
      error: error.message,
    })
  }
})

module.exports = router
