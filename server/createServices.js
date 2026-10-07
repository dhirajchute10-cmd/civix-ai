import "dotenv/config";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Service from "./models/Service.js";

connectDB();

const services = [
  {
    serviceName: "Birth Certificate",
    category: "Certificates",
    description: "Apply for registration and issuance of a birth certificate.",
    documents: [
      "Hospital or Birth Report",
      "Parent or Guardian Identity Proof",
      "Proof of Birth Details",
      "Address Proof"
    ],
    process: [
      "Submit the birth registration application.",
      "Provide the required birth and parent details.",
      "Upload or submit the supporting documents.",
      "Track the application status.",
      "Download or collect the certificate after approval."
    ],
    eligibility:
      "Parents or legal guardians can apply for registration of a child's birth.",
    processingTime: "Usually 7 to 15 working days",
    fees: "Fees vary depending on the registration authority and timing of registration.",
    applyLink: "https://www.crsorgi.gov.in/",
  },

  {
    serviceName: "Income Certificate",
    category: "Certificates",
    description:
      "Apply for an official certificate used to establish annual family income for government services and schemes.",
    documents: [
      "Aadhaar Card or Identity Proof",
      "Address Proof",
      "Income Proof",
      "Self-Declaration or Application Form"
    ],
    process: [
      "Register or log in to the government service portal.",
      "Select Income Certificate service.",
      "Enter applicant and income details.",
      "Upload the required documents.",
      "Submit the application and track its status."
    ],
    eligibility:
      "Residents requiring official proof of their annual income can apply.",
    processingTime: "Usually 7 to 15 working days",
    fees: "Nominal service charges may apply.",
    applyLink: "https://aaplesarkar.mahaonline.gov.in/",
  },

  {
    serviceName: "Driving License",
    category: "Transport",
    description:
      "Apply for a learner or permanent driving licence through the official transport portal.",
    documents: [
      "Proof of Age",
      "Proof of Address",
      "Identity Proof",
      "Learner Licence, where applicable",
      "Passport Size Photograph"
    ],
    process: [
      "Apply for the appropriate driving licence service online.",
      "Complete the required application details.",
      "Upload or submit the required documents.",
      "Pay the applicable government fee.",
      "Attend the required test or verification appointment.",
      "Receive the licence after successful completion."
    ],
    eligibility:
      "Applicants must meet the age and other eligibility requirements applicable to the type of driving licence.",
    processingTime: "Varies according to the service and verification process",
    fees: "Government fees vary according to the licence service.",
    applyLink: "https://parivahan.gov.in/",
  },

  {
    serviceName: "Passport",
    category: "Identity",
    description:
      "Apply for a new passport or passport-related services through Passport Seva.",
    documents: [
      "Proof of Present Address",
      "Proof of Date of Birth",
      "Identity Proof",
      "Recent Photograph, where required"
    ],
    process: [
      "Register on the Passport Seva portal.",
      "Complete the passport application form.",
      "Pay the applicable fee and schedule an appointment.",
      "Visit the Passport Seva Kendra with the required documents.",
      "Complete document verification and biometric procedures.",
      "Track the application until passport delivery."
    ],
    eligibility:
      "Indian citizens meeting the requirements for the selected passport service can apply.",
    processingTime: "Varies by application type and police verification.",
    fees: "Fees vary according to passport type, validity and service selected.",
    applyLink: "https://www.passportindia.gov.in/",
  },

  {
    serviceName: "Marriage Certificate",
    category: "Certificates",
    description:
      "Apply for official registration and issuance of a marriage certificate.",
    documents: [
      "Identity Proof of Both Spouses",
      "Address Proof of Both Spouses",
      "Marriage Proof or Wedding Photograph",
      "Photographs of Both Spouses",
      "Required Witness Documents"
    ],
    process: [
      "Complete the marriage registration application.",
      "Submit the required documents.",
      "Provide witness details where required.",
      "Attend verification or appointment if required.",
      "Receive the marriage certificate after approval."
    ],
    eligibility:
      "Married couples meeting the applicable marriage registration requirements can apply.",
    processingTime: "Varies according to the registering authority.",
    fees: "Registration fees vary according to the applicable rules and authority.",
    applyLink: "https://aaplesarkar.mahaonline.gov.in/",
  },

  {
    serviceName: "Death Certificate",
    category: "Certificates",
    description:
      "Apply for official registration and issuance of a death certificate.",
    documents: [
      "Medical or Hospital Death Report",
      "Deceased Person's Identity Details",
      "Applicant Identity Proof",
      "Address Details"
    ],
    process: [
      "Submit the death registration application.",
      "Provide details of the deceased person.",
      "Submit the supporting medical and identity documents.",
      "Complete verification by the registering authority.",
      "Download or collect the certificate after approval."
    ],
    eligibility:
      "A family member, legal representative or authorized person can apply for death registration.",
    processingTime: "Usually 7 to 15 working days",
    fees: "Fees vary according to the registration authority and timing.",
    applyLink: "https://www.crsorgi.gov.in/",
  },

  {
    serviceName: "Aadhaar Card",
    category: "Identity",
    description:
      "Apply for Aadhaar enrolment or access Aadhaar-related online services.",
    documents: [
      "Proof of Identity",
      "Proof of Address",
      "Proof of Date of Birth, where required"
    ],
    process: [
      "Locate an authorized Aadhaar enrolment centre.",
      "Submit the required identity and address documents.",
      "Complete biometric and demographic enrolment.",
      "Collect the enrolment acknowledgement.",
      "Track Aadhaar generation or update status."
    ],
    eligibility:
      "Residents of India can enrol for Aadhaar subject to the applicable UIDAI enrolment requirements.",
    processingTime: "Processing time varies depending on verification and UIDAI processing.",
    fees: "Aadhaar enrolment is free. Applicable charges may apply for certain update services.",
    applyLink: "https://myaadhaar.uidai.gov.in/",
  },

  {
    serviceName: "Voter ID",
    category: "Identity",
    description:
      "Apply for voter registration and related electoral services.",
    documents: [
      "Age Proof",
      "Address Proof",
      "Recent Photograph",
      "Identity Proof"
    ],
    process: [
      "Open the official Voter Service Portal.",
      "Select the appropriate voter registration service.",
      "Enter the applicant details.",
      "Upload the required documents and photograph.",
      "Submit the application.",
      "Track the application status."
    ],
    eligibility:
      "Eligible Indian citizens who meet the applicable age and electoral registration requirements can apply.",
    processingTime: "Varies according to electoral verification.",
    fees: "Voter registration is generally free.",
    applyLink: "https://voters.eci.gov.in/",
  },
];

const insertServices = async () => {
  try {
    await Service.deleteMany();

    await Service.insertMany(services);

    console.log("Government Services Added Successfully");

    mongoose.connection.close();
  } catch (error) {
    console.log(error);

    mongoose.connection.close();
  }
};

insertServices();