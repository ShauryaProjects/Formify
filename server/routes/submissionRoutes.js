const express = require("express")
const router = express.Router()
const Submission = require("../models/Submission")
const Form = require("../models/Form")

// POST /api/forms/:formId/submit - Submit a form response
router.post("/:formId/submit", async (req, res) => {
  try {
    const { formId } = req.params
    const { answers } = req.body

    // Verify form exists
    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      })
    }

    if (!answers || answers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Answers are required",
      })
    }

    const submission = new Submission({
      formId,
      answers,
    })

    await submission.save()

    res.status(201).json({
      success: true,
      data: submission,
      message: "Form submitted successfully",
    })
  } catch (error) {
    console.error("Error submitting form:", error)

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Invalid form ID",
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to submit form",
      error: error.message,
    })
  }
})

// GET /api/forms/:formId/submissions - Get all submissions for a form
router.get("/:formId/submissions", async (req, res) => {
  try {
    const { formId } = req.params

    // Verify form exists
    const form = await Form.findById(formId)
    if (!form) {
      return res.status(404).json({
        success: false,
        message: "Form not found",
      })
    }

    const submissions = await Submission.find({ formId }).sort({ submittedAt: -1 })

    res.json({
      success: true,
      data: {
        form: {
          id: form._id,
          title: form.title,
          description: form.description,
        },
        submissions,
        count: submissions.length,
      },
      message: "Submissions retrieved successfully",
    })
  } catch (error) {
    console.error("Error fetching submissions:", error)

    if (error.kind === "ObjectId") {
      return res.status(404).json({
        success: false,
        message: "Invalid form ID",
      })
    }

    res.status(500).json({
      success: false,
      message: "Failed to fetch submissions",
      error: error.message,
    })
  }
})

module.exports = router
