const express = require("express")
const router = express.Router()
const Form = require("../models/Form")

// GET /api/forms - Get all forms
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find({})
      .select("title description createdAt _id")
      .sort({ createdAt: -1 })

    res.json({
      success: true,
      data: forms,
      message: "Forms retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching forms:", error)
    res.status(500).json({
      success: false,
      message: "Failed to fetch forms",
      error: error.message,
    })
  }
})

// POST /api/forms - Create a new form
router.post("/", async (req, res) => {
  try {
    const { title, description, questions, steps, createdBy } = req.body

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      })
    }

    // If questions are provided as a flat array, organize them by stepId
    let organizedSteps = steps || []
    
    if (questions && questions.length > 0) {
      // Group questions by stepId
      const questionsByStep = {}
      questions.forEach(q => {
        if (!questionsByStep[q.stepId]) {
          questionsByStep[q.stepId] = []
        }
        questionsByStep[q.stepId].push({
          type: q.type,
          label: q.text,
          options: q.options || [],
          required: q.required || false
        })
      })

      // Create steps with their questions
      organizedSteps = Object.keys(questionsByStep).map(stepId => {
        const step = steps?.find(s => s.id === stepId) || { id: stepId, title: `Step ${stepId.split('-')[1] || '1'}` }
        return {
          title: step.title,
          questions: questionsByStep[stepId]
        }
      })
    }

    const form = new Form({
      title,
      description,
      steps: organizedSteps,
      createdBy: createdBy || "anonymous",
    })

    await form.save()

    res.status(201).json({
      success: true,
      data: form,
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
