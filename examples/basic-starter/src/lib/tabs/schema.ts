import type { Schema } from "@sjsf/form";

export const schema = {
  title: "Employee Onboarding",
  type: "array",
  items: [
    {
      title: "Personal Information",
      type: "array",
      items: [
        {
          title: "Basic Details",
          type: "object",
          properties: {
            firstName: {
              type: "string",
              title: "First Name",
            },
            lastName: {
              type: "string",
              title: "Last Name",
            },
            dateOfBirth: {
              type: "string",
              title: "Date of Birth",
              format: "date",
            },
          },
          required: ["firstName", "lastName"],
        },
        {
          title: "Contact",
          type: "object",
          properties: {
            email: {
              type: "string",
              title: "Email",
              format: "email",
            },
            phone: {
              type: "string",
              title: "Phone Number",
            },
          },
          required: ["email"],
        },
        {
          title: "Address",
          type: "object",
          properties: {
            street: {
              type: "string",
              title: "Street",
            },
            city: {
              type: "string",
              title: "City",
            },
            state: {
              type: "string",
              title: "State",
            },
            zipCode: {
              type: "string",
              title: "ZIP Code",
              pattern: "^[0-9]{5}(-[0-9]{4})?$",
            },
          },
        },
      ],
    },
    {
      title: "Employment",
      type: "array",
      items: [
        {
          title: "Position",
          type: "object",
          properties: {
            department: {
              type: "string",
              title: "Department",
              enum: ["Engineering", "Marketing", "Sales", "HR", "Finance"],
            },
            jobTitle: {
              type: "string",
              title: "Job Title",
            },
            employmentType: {
              type: "string",
              title: "Employment Type",
              enum: ["Full-time", "Part-time", "Contract"],
            },
          },
          required: ["jobTitle"],
        },
        {
          title: "Compensation",
          type: "object",
          properties: {
            salary: {
              type: "number",
              title: "Annual Salary",
              minimum: 30000,
              maximum: 200000,
            },
            startDate: {
              type: "string",
              title: "Start Date",
              format: "date",
            },
          },
          required: ["salary"],
        },
        {
          title: "Benefits",
          type: "object",
          properties: {
            healthInsurance: {
              type: "boolean",
              title: "Health Insurance",
            },
            retirementPlan: {
              type: "string",
              title: "Retirement Plan",
              enum: ["401k", "IRA", "None"],
            },
          },
        },
      ],
    },
  ],
} as const satisfies Schema;
