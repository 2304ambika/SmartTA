// content.js
export const quizLandingTooltips = {
    search: {
      title: "Search Question Banks",
      description: "Search for question banks by title."
    },
    createQuiz: {
      title: "Create Question Bank",
      description: "Click to create a new question bank."
    },
    viewTest: {
      title: "View Question Bank",
      description: "Click to view the questions of this topic."
    },
    // backButton: {
    //   title: "Back",
    //   description: "Click to go back to the question bank list."
    // }
  };

  export const generateNewQuizTooltips = {
    useTextTab: {
      title: "Use Text",
      description: "Paste your text to generate questions."
    },
    uploadFileTab: {
      title: "Upload File",
      description: "Upload a PDF or Word file to generate questions."
    },
    textInput: {
      title: "Text Input",
      description: "Paste your text here to generate questions."
    },
    fileInput: {
      title: "File Input",
      description: "Select a PDF or Word file to upload."
    },
    titleInput: {
      title: "Question Bank Title",
      description: "Enter the title of the question bank."
    },
    numQuestionsInput: {
      title: "Number of Questions",
      description: "Specify the number of questions to generate."
    },
    questionTypesSelect: {
      title: "Question Types",
      description: "Choose the types of questions to include."
    },
    purposeSelect: {
      title: "Purpose",
      description: "Select the purpose of the question bank."
    },
    useTab: {
      title: "Tabs",
      description: "Change tabs based on type of content."
    },
  };

// addQuestionTooltips.js
export const addQuestionTooltips = {
    useTab: {
        title: "Tabs",
        description: "Change tabs based on need to manually add question or generate questions using GenAI."
      },
    // manualTab: {
    //   title: "Manual",
    //   description: "Add your own created question manually."
    // },
    // uploadFileTab: {
    //   title: "Upload File",
    //   description: "Upload a PDF or Word file to generate questions."
    // },
    questionInput: {
      title: "Question",
      description: "Enter the question text."
    },
    optionInput: {
      title: "Option",
      description: "Enter an option for the question."
    },
    answerInput: {
      title: "Answer",
      description: "Enter the correct answer(s) for the question."
    },
    addAnswerButton: {
      title: "Add Answer",
      description: "Add another correct answer."
    },
    fileInput: {
      title: "File Input",
      description: "Select a PDF or Word file to upload."
    },
    numQuestionsInput: {
      title: "Number of Questions",
      description: "Specify the number of questions to generate from the file."
    },
    questionTypesSelect: {
      title: "Question Types",
      description: "Choose the types of questions to include."
    },
    // cancelButton: {
    //   title: "Cancel",
    //   description: "Cancel the question addition process."
    // },
    // saveButton: {
    //   title: "Save",
    //   description: "Save the manually added question."
    // },
    // generateButton: {
    //   title: "Generate",
    //   description: "Generate questions from the uploaded file."
    // }
  };

  export const questionManagerContent = {
    backButton: {
      title: "Back",
      description: "Go back to the previous page."
    },
    downloadButton: {
      title: "Download Questions",
      description: "Download questions in PPT format."
    },
    editToggle: {
      title: "Edit Questionnaire",
      description: "Toggle to 'ON' to edit the questionnaire. Toggle to 'OFF' to save the changes."
    },
    addQuestionButton: {
      title: "Add Question",
      description: "Add a new question to the question bank."
    },
    questionFields: {
        title: "Questions",
        description: "View and edit the text of the question, options or answer."
    },
    deleteButton: {
      title: "Delete Question",
      description: "Delete this question from the question bank."
    }
  };
  
export const summaryPageContent = {
    uploadFile: {
      title: 'Upload File',
      description: 'Click the "Upload File" button to select and upload a PDF or Word document for summarization.',
    },
    wordLimit: {
      title: 'Word Limit',
      description: 'Specify the word limit for the summary before generating it.',
    },
    generateSummary: {
      title: 'Generate Summary',
      description: 'Click the "Generate" button to create a summary of the uploaded document based on the specified word limit.',
    },
    copyText: {
        title: 'Copy Text',
        description: 'Click the "Copy Text" button to copy the extracted text to your clipboard.',
      },
      download: {
        title: 'Download',
        description: 'Click the "Download Word File" button to download the extracted text as a Word document.',
      },
  };
  
  export const whiteboardPageContent = {
    uploadImage: {
      title: 'Upload Image',
      description: 'Click the "Upload Image" button to select and upload a whiteboard image for processing.',
    },
    processImage: {
      title: 'Process Image',
      description: 'Click the "Upload and Process" button to extract text from the uploaded whiteboard image.',
    },
    copyText: {
      title: 'Copy Text',
      description: 'Click the "Copy Text" button to copy the extracted text to your clipboard.',
    },
    download: {
      title: 'Download',
      description: 'Click the "Download Word File" button to download the extracted text as a Word document.',
    },
  };

  export const pollCreationContent = {
    pollTopicField: {
      title: "Poll Topic",
      description: "Enter the topic of the poll you wish to create."
    },
    numberOfQuestionsField: {
      title: "Number of Questions",
      description: "Specify how many questions you want in the poll."
    },
    generatePollButton: {
      title: "Information",
      description: "Create the poll with the specified topic/content and number of questions.Poll question(s) and statistics will be displayed with an end poll button that will end the active poll and finalize the results."
    },
    // pollCard: {
    //   title: "Poll Card",
    //   description: "Displays the poll question and statistics. Teachers can end the poll here if it is active."
    // },
    endPollButton: {
      title: "End Poll",
      description: "Click to end the active poll and finalize the results."
    }
  };

  export const pptCreationContent = {
    fileUploadButton: {
      title: "Upload File",
      description: "Click to select and upload a PDF or Word file for creating a PPT."
    },
    slideCountField: {
      title: "Slide Count Limit",
      description: "Specify the maximum number of slides for the generated PPT."
    },
    generatePPTButton: {
      title: "Generate PPT",
      description: "Click to generate the PPT based on the uploaded file and specified slide count limit."
    },
    downloadPPTButton: {
      title: "Download Generated Presentation",
      description: "Click to download the generated PPT file."
    }
  };

  export const studentQuizSearchContent = {
    searchField: {
      title: "Search Question Banks",
      description: "Search for available question banks based on topic."
    },
    quizCard: {
      title: "Question Bank Card",
      description: "Displays individual question banks with details such as title, date, number of questions, and purpose. The 'Attempt Test' button allows you to start a test based on this question bank."
    },
    playTestButton: {
      title: "Attempt Test",
      description: "Click to start a test based on the topic."
    }
  };

  export const studentPollParticipationContent = {
    pollCard: {
      title: "Poll Card",
      description: "Displays the poll question and available options. Select an option to answer the poll."
    },
    optionSelection: {
      title: "Select Option",
      description: "Choose your answer from the available options."
    },
    submitButton: {
      title: "Submit All Answers",
      description: "Click to submit your responses for all polls."
    }
  };
  
//   export const quizParticipationContent = {
//     // headerSection: {
//     //   title: "Header Section",
//     //   description: "Displays the quiz title, the user's avatar, and the remaining time for the quiz."
//     // },
//     timer: {
//         title: "Timer",
//         description: "Displays the remaining time for the quiz."
//       },
//     questionCard: {
//       title: "Question Card",
//       description: "Displays individual quiz questions with options. Users can select answers by checking checkboxes or radio buttons."
//     },
//     answerSelection: {
//       title: "Answer Selection",
//       description: "Select the appropriate answer(s) for each question. For multiple-choice questions, select the correct option. For multiple-answer questions, check all applicable options."
//     },
//     submitButton: {
//       title: "Submit",
//       description: "Click to submit your answers for the quiz."
//     }
//   };

//   export const quizResultsContent = {
//     // headerSection: {
//     //   title: "Header Section",
//     //   description: "Shows the title of the results page and the button to navigate back."
//     // },
//     feedbackMessage: {
//       title: "Feedback Message",
//       description: "Displays the feedback message based on the quiz results."
//     },
//     scoreSection: {
//       title: "Score Section",
//       description: "Shows the user's score out of the total number of questions."
//     },
//     timeTaken: {
//       title: "Time Taken",
//       description: "Displays the total time taken to complete the quiz."
//     },
//     answerColorLegend: {
//       title: "Answer Color Legend",
//       description: "Explains the color coding used for answers: red for wrong answers, green for correct selected answers, and blue for correct non-selected answers."
//     },
//     reviewQuestions: {
//       title: "Review Questions",
//       description: "Displays a detailed review of the quiz questions with color-coded options indicating correct and selected answers."
//     }
//   };
  
  