import { useState, useRef, useEffect } from "react";

import {
  FaArrowLeft,
  FaCamera,
  FaCheckCircle,
  FaFileImage,
  FaMapMarkerAlt,
  FaRobot,
  FaUpload,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";

import { createComplaint } from "../services/complaintService";
import { improveComplaint } from "../services/aiService";
import { analyzeImage } from "../services/imageService";

import MapPicker from "../components/MapPicker";
import Footer from "../components/Footer";

import "../css/ReportComplaint.css";

function ReportComplaint() {
  const navigate = useNavigate();

  // =========================================================
  // FORM STATES
  // =========================================================

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // Image
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  // =========================================================
  // COMPLAINT AI
  // =========================================================

  const [priority, setPriority] = useState("");
  const [department, setDepartment] = useState("");
  const [improving, setImproving] = useState(false);

  // =========================================================
  // IMAGE AI
  // =========================================================

  const [loadingAI, setLoadingAI] = useState(false);
  const [imageAnalysis, setImageAnalysis] = useState(null);

  // Actual Cloudinary URL returned by backend
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  // =========================================================
  // SUBMIT
  // =========================================================

  const [submitting, setSubmitting] = useState(false);

  // =========================================================
  // MAP
  // =========================================================

  const [mapLocation, setMapLocation] = useState(null);

  // =========================================================
  // CAMERA
  // =========================================================

  const [cameraOpen, setCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const videoRef = useRef(null);
  const cameraStreamRef = useRef(null);

  // =========================================================
  // ATTACH CAMERA STREAM
  // =========================================================

  useEffect(() => {
    if (
      cameraOpen &&
      videoRef.current &&
      cameraStreamRef.current
    ) {
      videoRef.current.srcObject =
        cameraStreamRef.current;

      videoRef.current.play().catch((error) => {
        console.error(
          "Video playback error:",
          error
        );
      });
    }
  }, [cameraOpen]);

  // =========================================================
  // STOP CAMERA WHEN PAGE UNMOUNTS
  // =========================================================

  useEffect(() => {
    return () => {
      if (cameraStreamRef.current) {
        cameraStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        cameraStreamRef.current = null;
      }
    };
  }, []);

  // =========================================================
  // CLEAN IMAGE PREVIEW
  // =========================================================

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // =========================================================
  // START CAMERA
  // =========================================================

  const startCamera = async () => {
    setCameraError("");

    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError(
        "Camera access is unavailable in this browser. Try Chrome on localhost or HTTPS."
      );

      return;
    }

    try {
      // Stop previous stream
      if (cameraStreamRef.current) {
        cameraStreamRef.current
          .getTracks()
          .forEach((track) => {
            track.stop();
          });

        cameraStreamRef.current = null;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              ideal: "environment",
            },
          },
          audio: false,
        });

      cameraStreamRef.current = stream;

      setCameraOpen(true);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        setCameraError(
          "Camera permission was denied. Allow camera access in your browser settings and try again."
        );
      } else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device."
        );
      } else {
        setCameraError(
          "Unable to open the camera. Check that it is connected and not being used by another application."
        );
      }
    }
  };

  // =========================================================
  // STOP CAMERA
  // =========================================================

  const stopCamera = () => {
    if (cameraStreamRef.current) {
      cameraStreamRef.current
        .getTracks()
        .forEach((track) => {
          track.stop();
        });

      cameraStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setCameraOpen(false);
  };

  // =========================================================
  // CAPTURE PHOTO
  // =========================================================

  const capturePhoto = () => {
    const video = videoRef.current;

    if (
      !video ||
      !video.videoWidth ||
      !video.videoHeight
    ) {
      alert(
        "Camera is not ready yet. Please try again."
      );

      return;
    }

    const canvas =
      document.createElement("canvas");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context =
      canvas.getContext("2d");

    if (!context) {
      alert(
        "Unable to capture the photo. Please try again."
      );

      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          alert(
            "Unable to capture photo. Please try again."
          );

          return;
        }

        const photo = new File(
          [blob],
          `civix-complaint-${Date.now()}.jpg`,
          {
            type: "image/jpeg",
          }
        );

        if (preview) {
          URL.revokeObjectURL(preview);
        }

        setImage(photo);
        setPreview(
          URL.createObjectURL(photo)
        );

        // New image = old AI result invalid
        setImageAnalysis(null);
        setUploadedImageUrl("");

        stopCamera();
      },
      "image/jpeg",
      0.9
    );
  };

  // =========================================================
  // MAP LOCATION
  // =========================================================

  const handleMapLocation = async (
    selectedLocation
  ) => {
    setMapLocation(selectedLocation);

    const {
      latitude,
      longitude,
    } = selectedLocation;

    setLocation(
      `Latitude: ${latitude.toFixed(
        6
      )}, Longitude: ${longitude.toFixed(6)}`
    );

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );

      const data =
        await response.json();

      if (data.display_name) {
        setLocation(
          data.display_name
        );
      }
    } catch (error) {
      console.error(
        "Unable to get address:",
        error
      );

      setLocation(
        `Latitude: ${latitude.toFixed(
          6
        )}, Longitude: ${longitude.toFixed(6)}`
      );
    }
  };

  // =========================================================
  // IMPROVE COMPLAINT
  // =========================================================

  const handleImprove = async () => {
    if (!description.trim()) {
      alert(
        "Please enter the complaint description first."
      );

      return;
    }

    try {
      setImproving(true);

      const response =
        await improveComplaint(
          description
        );

      const aiData =
        response.data.data;

      setDescription(
        aiData.improvedDescription ||
          description
      );

      if (aiData.category) {
        setCategory(
          aiData.category
        );
      }

      if (aiData.priority) {
        setPriority(
          aiData.priority
        );
      }

      if (aiData.department) {
        setDepartment(
          aiData.department
        );
      }

      alert(
        "Complaint improved successfully!"
      );
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data
          ?.message ||
          "AI improvement failed. Please try again."
      );
    } finally {
      setImproving(false);
    }
  };

  // =========================================================
  // IMAGE SELECTION
  // =========================================================

  const handleImageChange = (e) => {
    const file =
      e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert(
        "Please select a valid image file."
      );

      e.target.value = "";

      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);

    setPreview(
      URL.createObjectURL(file)
    );

    // Clear previous image AI result
    setImageAnalysis(null);

    // Clear previous uploaded URL
    setUploadedImageUrl("");

    // Allow same image to be selected again
    e.target.value = "";
  };

  // =========================================================
  // REMOVE IMAGE
  // =========================================================

  const handleRemoveImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");

    setImageAnalysis(null);
    setUploadedImageUrl("");

    if (cameraOpen) {
      stopCamera();
    }
  };

  // =========================================================
  // ANALYZE IMAGE
  // =========================================================

  const handleAnalyzeImage = async () => {
    if (!image) {
      alert(
        "Please select or capture an image first."
      );

      return;
    }

    try {
      setLoadingAI(true);

      setImageAnalysis(null);

      console.log(
        "Sending image for CIVIX AI analysis..."
      );

      const response =
        await analyzeImage(image);

      console.log(
        "CIVIX AI response:",
        response.data
      );

      const responseData =
        response?.data || {};

      // =====================================================
      // GET AI RESULT
      // =====================================================

      const aiResult =
        responseData.aiResult ||
        responseData.data?.aiResult;

      // =====================================================
      // GET CLOUDINARY IMAGE URL
      // =====================================================

      const imageUrl =
        responseData.imageUrl ||
        responseData.data?.imageUrl;

      // =====================================================
      // VALIDATE AI RESULT
      // =====================================================

      if (!aiResult) {
        throw new Error(
          "AI analysis result was not returned by the server."
        );
      }

      // Save AI result
      setImageAnalysis(aiResult);

      // Save actual Cloudinary URL
      if (imageUrl) {
        setUploadedImageUrl(
          imageUrl
        );
      }

      // =====================================================
      // AI CATEGORY SUGGESTION
      // =====================================================

      if (
        aiResult.category &&
        !category
      ) {
        setCategory(
          aiResult.category
        );
      }

      // =====================================================
      // AI SEVERITY
      // =====================================================

      if (aiResult.severity) {
        setPriority(
          aiResult.severity
        );
      }

      // =====================================================
      // CATEGORY -> DEPARTMENT
      // =====================================================

      const departmentMap = {
        Road: "Public Works Department",

        Water:
          "Water Supply Department",

        Garbage:
          "Sanitation Department",

        Electricity:
          "Electricity Department",

        Drainage:
          "Drainage Department",

        "Street Light":
          "Street Light Department",

        Others:
          "Municipal Office",
      };

      if (aiResult.category) {
        setDepartment(
          departmentMap[
            aiResult.category
          ] ||
            "Municipal Office"
        );
      }

    } catch (error) {
      console.error(
        "Image analysis error:",
        error
      );

      alert(
        error.response?.data
          ?.message ||
          error.message ||
          "Image analysis failed. Please try again."
      );
    } finally {
      setLoadingAI(false);
    }
  };

  // =========================================================
  // SUBMIT COMPLAINT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!localStorage.getItem("token")) {
      alert(
        "Please login before submitting a complaint."
      );

      navigate("/login");

      return;
    }

    try {
      setSubmitting(true);

      // =====================================================
      // COMPLAINT DATA
      // =====================================================

      const complaintData = {
        title,
        description,
        category,
        location,

        // Store actual Cloudinary URL
        image:
          uploadedImageUrl || "",
      };

      console.log(
        "Submitting complaint:",
        complaintData
      );

      const response =
        await createComplaint(
          complaintData
        );

      alert(
        response.data.message ||
          "Complaint submitted successfully!"
      );

      // =====================================================
      // RESET
      // =====================================================

      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");

      setPriority("");
      setDepartment("");

      setMapLocation(null);

      handleRemoveImage();

      setImageAnalysis(null);
      setUploadedImageUrl("");

    } catch (error) {
      console.error(error);

      if (
        error.response?.status === 401
      ) {
        alert(
          "Your session has expired. Please login again."
        );

        navigate("/login");

        return;
      }

      alert(
        error.response?.data
          ?.message ||
          "Something went wrong while submitting the complaint."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="report-page">
      <main>

        {/* =================================================
            HEADER
        ================================================= */}

        <section className="report-header">

          <div className="report-container">

            <button
              type="button"
              className="report-back"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              <FaArrowLeft />

              Back to Dashboard
            </button>

            <div className="report-heading">

              <div>

                <span className="report-kicker">
                  Citizen grievance
                </span>

                <h1>
                  Report a Civic Complaint
                </h1>

                <p>
                  Help improve your neighbourhood
                  by reporting a civic issue.
                  Provide clear details and
                  location so the issue can be
                  properly reviewed.
                </p>

              </div>

              <div className="report-reference">

                <FaCheckCircle />

                <span>
                  Your complaint is submitted
                  through your authenticated
                  citizen account.
                </span>

              </div>

            </div>

          </div>

        </section>

        {/* =================================================
            MAIN
        ================================================= */}

        <section className="report-main">

          <div className="report-container">

            <form
              className="complaint-form"
              onSubmit={handleSubmit}
            >

              <div className="form-main">

                {/* =================================================
                    01 COMPLAINT INFORMATION
                ================================================= */}

                <section className="form-card">

                  <div className="form-card-heading">

                    <span>
                      01
                    </span>

                    <div>

                      <small>
                        Complaint information
                      </small>

                      <h2>
                        Tell us about the issue
                      </h2>

                    </div>

                  </div>

                  {/* TITLE */}

                  <div className="input-group">

                    <label htmlFor="title">
                      Complaint Title
                    </label>

                    <input
                      id="title"
                      type="text"
                      placeholder="Example: Large pothole near main road"
                      value={title}
                      onChange={(e) =>
                        setTitle(
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* DESCRIPTION */}

                  <div className="input-group">

                    <div className="label-row">

                      <label htmlFor="description">
                        Description
                      </label>

                      <span>
                        {description.length} characters
                      </span>

                    </div>

                    <textarea
                      id="description"
                      rows="7"
                      placeholder="Describe what happened, where the problem is and any useful details..."
                      value={description}
                      onChange={(e) =>
                        setDescription(
                          e.target.value
                        )
                      }
                      required
                    />

                    <button
                      type="button"
                      className="ai-improve-button"
                      onClick={handleImprove}
                      disabled={improving}
                    >

                      <FaRobot />

                      {improving
                        ? "Improving complaint..."
                        : "Improve with CIVIX AI"}

                    </button>

                  </div>

                  {/* CATEGORY */}

                  <div className="input-group">

                    <label htmlFor="category">
                      Complaint Category
                    </label>

                    <select
                      id="category"
                      value={category}
                      onChange={(e) =>
                        setCategory(
                          e.target.value
                        )
                      }
                      required
                    >

                      <option value="">
                        Select complaint category
                      </option>

                      <option value="Road">
                        Road
                      </option>

                      <option value="Water">
                        Water
                      </option>

                      <option value="Garbage">
                        Garbage
                      </option>

                      <option value="Electricity">
                        Electricity
                      </option>

                      <option value="Drainage">
                        Drainage
                      </option>

                      <option value="Street Light">
                        Street Light
                      </option>

                      <option value="Others">
                        Others
                      </option>

                    </select>

                  </div>

                </section>

                {/* =================================================
                    GENERAL AI COMPLAINT ANALYSIS
                ================================================= */}

                {(priority || department) && (

                  <section className="form-card ai-result-card">

                    <div className="form-card-heading">

                      <span className="ai-number">
                        AI
                      </span>

                      <div>

                        <small>
                          AI assistance
                        </small>

                        <h2>
                          Complaint Analysis
                        </h2>

                      </div>

                    </div>

                    <div className="ai-result-grid">

                      {priority && (

                        <div className="ai-result-item">

                          <small>
                            Priority
                          </small>

                          <strong>
                            {priority}
                          </strong>

                        </div>

                      )}

                      {department && (

                        <div className="ai-result-item">

                          <small>
                            Suggested Department
                          </small>

                          <strong>
                            {department}
                          </strong>

                        </div>

                      )}

                    </div>

                    <p className="ai-disclaimer">
                      AI suggestions are provided
                      as assistance and do not replace
                      the final decision of the
                      responsible authority.
                    </p>

                  </section>

                )}

                {/* =================================================
                    02 LOCATION
                ================================================= */}

                <section className="form-card">

                  <div className="form-card-heading">

                    <span>
                      02
                    </span>

                    <div>

                      <small>
                        Issue location
                      </small>

                      <h2>
                        Where is the problem?
                      </h2>

                    </div>

                  </div>

                  <div className="input-group">

                    <label htmlFor="location">
                      Complaint Location
                    </label>

                    <div className="location-input">

                      <FaMapMarkerAlt />

                      <input
                        id="location"
                        type="text"
                        placeholder="Enter address or select a location on the map"
                        value={location}
                        onChange={(e) =>
                          setLocation(
                            e.target.value
                          )
                        }
                        required
                      />

                    </div>

                  </div>

                  <div className="map-heading">

                    <span>
                      <FaMapMarkerAlt />
                    </span>

                    <div>

                      <strong>
                        Select on Map
                      </strong>

                      <small>
                        Select the exact location
                        of the civic issue.
                      </small>

                    </div>

                  </div>

                  <div className="map-wrapper">

                    <MapPicker
                      onLocationSelect={
                        handleMapLocation
                      }
                    />

                  </div>

                  {mapLocation && (

                    <div className="coordinates-box">

                      <FaCheckCircle />

                      <div>

                        <strong>
                          Location selected
                        </strong>

                        <span>
                          Latitude:{" "}
                          {mapLocation.latitude.toFixed(
                            6
                          )}

                          {" · "}

                          Longitude:{" "}
                          {mapLocation.longitude.toFixed(
                            6
                          )}
                        </span>

                      </div>

                    </div>

                  )}

                </section>

                {/* =================================================
                    03 IMAGE EVIDENCE
                ================================================= */}

                <section className="form-card">

                  <div className="form-card-heading">

                    <span>
                      03
                    </span>

                    <div>

                      <small>
                        Evidence
                      </small>

                      <h2>
                        Add an image
                      </h2>

                    </div>

                  </div>

                  {/* UPLOAD AREA */}

                  <div className="upload-area">

                    <div className="upload-icon">
                      <FaFileImage />
                    </div>

                    <div className="upload-content">

                      <strong>
                        Upload an image of the issue
                      </strong>

                      <span>
                        A clear image can help explain
                        the problem.
                      </span>

                      <div className="upload-actions">

                        {/* CAMERA */}

                        <button
                          type="button"
                          className="upload-button"
                          onClick={startCamera}
                          disabled={cameraOpen}
                        >

                          <FaCamera />

                          Open Camera

                        </button>

                        {/* FILE UPLOAD */}

                        <label
                          htmlFor="complaint-image"
                          className="upload-button"
                        >

                          <FaUpload />

                          Choose Image

                        </label>

                        <input
                          id="complaint-image"
                          type="file"
                          accept="image/*"
                          onChange={
                            handleImageChange
                          }
                        />

                      </div>

                    </div>

                  </div>

                  {/* CAMERA ERROR */}

                  {cameraError && (

                    <p
                      className="camera-error"
                      role="alert"
                    >
                      {cameraError}
                    </p>

                  )}

                  {/* =================================================
                      LIVE CAMERA
                  ================================================= */}

                  {cameraOpen && (

                    <div className="camera-preview">

                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="camera-video"
                      />

                      <div className="camera-controls">

                        <button
                          type="button"
                          className="upload-button"
                          onClick={capturePhoto}
                        >

                          <FaCamera />

                          Capture Photo

                        </button>

                        <button
                          type="button"
                          className="camera-cancel-button"
                          onClick={stopCamera}
                        >
                          Cancel
                        </button>

                      </div>

                    </div>

                  )}

                  {/* SELECTED FILE */}

                  {image && (

                    <div className="selected-file">

                      <div>

                        <FaFileImage />

                        <span>
                          {image.name}
                        </span>

                      </div>

                      <button
                        type="button"
                        onClick={
                          handleRemoveImage
                        }
                      >
                        Remove
                      </button>

                    </div>

                  )}

                  {/* IMAGE PREVIEW */}

                  {preview && (

                    <div className="preview-box">

                      <img
                        src={preview}
                        alt="Complaint preview"
                        className="preview-image"
                      />

                    </div>

                  )}

                  {/* =================================================
                      ANALYZE IMAGE BUTTON
                  ================================================= */}

                  <button
                    type="button"
                    className="image-ai-button"
                    onClick={
                      handleAnalyzeImage
                    }
                    disabled={
                      !image ||
                      loadingAI
                    }
                  >

                    <FaRobot />

                    {loadingAI
                      ? "Analyzing..."
                      : "Analyze Image"}

                  </button>

                  {/* =================================================
                      REAL IMAGE AI RESULT
                  ================================================= */}

                  {imageAnalysis && (

                    <section className="form-card ai-result-card">

                      <div className="form-card-heading">

                        <span className="ai-number">
                          AI
                        </span>

                        <div>

                          <small>
                            Vision analysis
                          </small>

                          <h2>
                            Image Analysis
                          </h2>

                        </div>

                      </div>

                      <div className="ai-result-grid">

                        {/* CIVIC RELEVANCE */}

                        <div className="ai-result-item">

                          <small>
                            Civic Relevance
                          </small>

                          <strong>
                            {imageAnalysis.civicIssue
                              ? "Civic issue detected"
                              : "No civic issue detected"}
                          </strong>

                        </div>

                        {/* DETECTED ISSUE */}

                        <div className="ai-result-item">

                          <small>
                            Detected Issue
                          </small>

                          <strong>
                            {imageAnalysis.detectedIssue ||
                              "No civic issue detected"}
                          </strong>

                        </div>

                        {/* CATEGORY */}

                        <div className="ai-result-item">

                          <small>
                            Category
                          </small>

                          <strong>
                            {imageAnalysis.category ||
                              "Others"}
                          </strong>

                        </div>

                        {/* SEVERITY */}

                        <div className="ai-result-item">

                          <small>
                            Severity
                          </small>

                          <strong>
                            {imageAnalysis.severity ||
                              "Low"}
                          </strong>

                        </div>

                        {/* SUMMARY */}

                        <div className="ai-result-item">

                          <small>
                            AI Summary
                          </small>

                          <strong>
                            {imageAnalysis.summary ||
                              "The image was analyzed by CIVIX AI."}
                          </strong>

                        </div>

                        {/* RECOMMENDED ACTION */}

                        <div className="ai-result-item">

                          <small>
                            Recommended Action
                          </small>

                          <strong>
                            {imageAnalysis.recommendedAction ||
                              "Please review the image and complaint details."}
                          </strong>

                        </div>

                      </div>

                      <p className="ai-disclaimer">

                        CIVIX AI image analysis is
                        provided as assistance based
                        on visible information in the
                        uploaded image. Please review
                        the result before submitting
                        the complaint.

                      </p>

                    </section>

                  )}

                  {/* =================================================
                      IMAGE UPLOAD SUCCESS
                  ================================================= */}

                  {uploadedImageUrl && (

                    <div className="coordinates-box">

                      <FaCheckCircle />

                      <div>

                        <strong>
                          Image ready for submission
                        </strong>

                        <span>
                          The analyzed image has
                          been uploaded successfully.
                        </span>

                      </div>

                    </div>

                  )}

                </section>

                {/* =================================================
                    SUBMIT
                ================================================= */}

                <div className="submit-area">

                  <div>

                    <FaCheckCircle />

                    <p>
                      Please review your complaint
                      details before submitting.
                    </p>

                  </div>

                  <button
                    type="submit"
                    className="submit-complaint-button"
                    disabled={submitting}
                  >

                    {submitting
                      ? "Submitting..."
                      : "Submit Complaint"}

                  </button>

                </div>

              </div>

              {/* =================================================
                  SIDEBAR
              ================================================= */}

              <aside className="report-sidebar">

                <div className="report-info-card">

                  <div className="sidebar-title">
                    <span>
                      Complaint journey
                    </span>
                  </div>

                  <div className="journey-step active">

                    <span>
                      01
                    </span>

                    <div>

                      <strong>
                        Report
                      </strong>

                      <p>
                        Describe the civic issue
                        clearly.
                      </p>

                    </div>

                  </div>

                  <div className="journey-step">

                    <span>
                      02
                    </span>

                    <div>

                      <strong>
                        Submit
                      </strong>

                      <p>
                        Add location and evidence,
                        then submit.
                      </p>

                    </div>

                  </div>

                  <div className="journey-step">

                    <span>
                      03
                    </span>

                    <div>

                      <strong>
                        Track
                      </strong>

                      <p>
                        Follow the complaint from
                        My Complaints.
                      </p>

                    </div>

                  </div>

                </div>

                {/* AI NOTE */}

                <div className="report-side-note">

                  <FaRobot />

                  <div>

                    <strong>
                      CIVIX AI Assistance
                    </strong>

                    <p>
                      AI can help improve the complaint
                      description, suggest a category,
                      estimate priority, suggest a
                      department and analyze uploaded
                      complaint images.
                    </p>

                  </div>

                </div>

                {/* SECURITY */}

                <div className="report-side-security">

                  <FaCheckCircle />

                  <div>

                    <strong>
                      Citizen account required
                    </strong>

                    <p>
                      Your complaint is linked to
                      your authenticated citizen
                      account.
                    </p>

                  </div>

                </div>

              </aside>

            </form>

          </div>

        </section>

      </main>

      <Footer />
    </div>
  );
}

export default ReportComplaint;

