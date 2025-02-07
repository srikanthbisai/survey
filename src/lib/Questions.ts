import {Question} from "../types"

export const questions: Question[] = [
    {
      id: 1,
      text: "How likely is it that you would recommend our company to a friend or colleague?",
      type: "rating",
      options: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
      labels: ["NOT AT ALL LIKELY", "EXTREMELY LIKELY"]
    },
    {
      id: 2,
      text: "Overall, how satisfied or dissatisfied are you with our company?",
      type: "single",
      options: [
        "Very satisfied",
        "Somewhat satisfied",
        "Neither satisfied nor dissatisfied",
        "Somewhat dissatisfied",
        "Very dissatisfied"
      ]
    },
    {
      id: 3,
      text: "Which of the following words would you use to describe our products? Select all that apply.",
      type: "multiple",
      options: [
        "Reliable",
        "High quality",
        "Useful",
        "Unique",
        "Good value for money",
        "Overpriced",
        "Impractical",
        "Ineffective",
        "Poor quality",
        "Unreliable"
      ]
    },
    {
      id: 4,
      text: "How well do our products meet your needs?",
      type: "single",
      options: [
        "Extremely well",
        "Very well",
        "Somewhat well",
        "Not so well",
        "Not at all well"
      ]
    },
    {
      id: 5,
      text: "How would you rate the quality of the product?",
      type: "single",
      options: [
        "Very high quality",
        "High quality",
        "Neither high nor low quality",
        "Low quality",
        "Very low quality"
      ]
    },
    {
      id: 6,
      text: "How would you rate the value for money of the product?",
      type: "single",
      options: [
        "Excellent",
        "Above average",
        "Average",
        "Below average",
        "Poor"
      ]
    },
    {
      id: 7,
      text: "How responsive have we been to your questions about our services?",
      type: "single",
      options: [
        "Extremely responsive",
        "Very responsive",
        "Somewhat responsive",
        "Not so responsive",
        "Not at all responsive",
        "Not applicable"
      ]
    },
    {
      id: 8,
      text: "How long have you been a customer of our company?",
      type: "single",
      options: [
        "This is my first purchase",
        "Less than six months",
        "Six months to a year",
        "1-2 years",
        "3 or more years",
        "I haven't made a purchase yet"
      ]
    },
    {
      id: 9,
      text: "How likely are you to purchase any of our products again?",
      type: "single",
      options: [
        "Extremely likely",
        "Very likely",
        "Somewhat likely",
        "Not so likely",
        "Not at all likely"
      ]
    },
    {
      id: 10,
      text: "Do you have any other comments, questions, or concerns?",
      type: "text"
    }
  ];