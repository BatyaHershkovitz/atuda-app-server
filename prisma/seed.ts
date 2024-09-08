import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.requestType.createMany({
    data: [
      {
        name: "בקשה לקיצור / הארכת דח”ש",
        description:
          "עתודאים המעוניינים לבקש הארכה או קיצור של דחיית השירות מעבר לתקופת הדח”ש הנוכחית יגישו בקשה זו",
        duration: 1,
        declarationText:
          "הנני מצהיר כי הפרטים שמסרתי נכונים ושידוע לי כי במידה ותאושר בקשתי, לא אהיה זכאי/ת למענק בתקופת הדח”ש הנוספת",
        stagesFlow: {
          options: [
            {
              name: "academic",
              displayName: "אקדמית",
              stages: [
                "selectEndDate_toggle",
                "reason",
                "attachingFiles_shortExtend"
              ]
            },
            {
              name: "financially",
              displayName: "כלכלית",
              stages: [
                "selectEndDate_toggle",
                "reason",
                "attachingFiles_shortExtend"
              ]
            },
            {
              name: "medically",
              displayName: "רפואית",
              stages: [
                "selectEndDate_toggle",
                "reason",
                "attachingFiles_shortExtend"
              ]
            },
            {
              name: "personally",
              displayName: "אישית",
              stages: [
                "selectEndDate_toggle",
                "reason",
                "attachingFiles_shortExtend"
              ]
            }
          ],
          layout: "squares",
          menuTitle: "סיבת הבקשה"
        }
      },
      {
        name: "בקשה לשינוי מסלול לימודים",
        description:
          "עתודאי/ת המעוניינים לשנות את המקצוע / אופי המסלול / מוסד הלימודים בו לומדים, יפתחו בקשה זו",
        duration: 1,
        declarationText: "הנני מצהיר כי הפרטים שמסרתי נכונים",
        stagesFlow: {
          options: [
            {
              name: "institution",
              displayName: "שינוי מוסד לימודים",
              stages: [
                "selectInstitution",
                "selectEndDate_dropdown",
                "reason",
                "attachingFiles_changeStudy"
              ]
            },
            {
              name: "major",
              displayName: "שינוי במגמה ראשית / משנית",
              stages: [
                "selectMajor",
                "selectEndDate_dropdown",
                "reason",
                "attachingFiles_changeStudy"
              ]
            },
            {
              name: "institution&major",
              displayName: "שינוי מגמה ראשית/משנית ומוסד לימודים",
              stages: [
                "selectInstitution",
                "selectMajor",
                "selectEndDate_dropdown",
                "reason",
                "attachingFiles_changeStudy"
              ]
            }
          ],
          layout: "lines",
          menuTitle: "השינוי המבוקש"
        }
      },
      {
        name: "בקשה לעזיבת מסלול העתודה האקדמית",
        description:
          "עתודאי/ת המעוניינים להפסיק את לימודיהם או שמוסד הלימודים הפסיק את לימודיהם, ימלאו בקשה זו",
        duration: 1,
        declarationText:
          "הנני מצהיר כי הפרטים שמסרתי נכונים ושידוע לי כי מתאריך אישור הפסקת לימודי אקבל צו/הודעה/שיחה טלפונית להתייצב פיזית לעזיבת מסלול במדור סטודנטים, ואם לא אתייצב, יפתח תהליך נפקדות נגדי. בנוסף ידוע לי כי אהיה מחויב בהחזר מלא של מענקי העתודה אותם קיבלתי במהלך לימודי",
        stagesFlow: {
          options: [
            {
              name: "academic",
              displayName: "אקדמית",
              stages: ["reason", "attachingFiles_leaveStudy"]
            },
            {
              name: "financially",
              displayName: "כלכלית",
              stages: ["reason", "attachingFiles_leaveStudy"]
            },
            {
              name: "medically",
              displayName: "רפואית",
              stages: ["reason", "attachingFiles_leaveStudy"]
            },
            {
              name: "personally",
              displayName: "אישית",
              stages: ["reason", "attachingFiles_leaveStudy"]
            }
          ],
          layout: "squares",
          menuTitle: "סיבת הבקשה"
        }
      }
    ]
  });

  await prisma.stage.createMany({
    data: [
      {
        key: "selectEndDate_toggle",
        header: "תאריך סיום לימודים מבוקש",
        title: "בחירת שנה ותאריך",
        description:
          "התאריך המבוקש יכול להיות בטווח של שנתיים  מתאריך הסיום הנוכחי ובמועדים המצויינים בלבד תאריך תום דח”ש ראשוני: ${expiryDate}",
        schema: {
          "type": "object",
          "required": ["requestType", "semestersNumber"],
          "properties": {
            "requestType": {
              "type": "string",
              "title": "סוג הבקשה",
              "layout": {
                "props": {
                  "firstLabel": "קיצור",
                  "secondLabel": "הארכה"
                },
                "slots": {
                  "component": "toggle-button"
                }
              }
            },
            "semestersNumber": {
              "type": "string",
              "title": "כמות סמסטרים",
              "layout": {
                "props": {
                  "data": ["1", "2", "3", "4"]
                },
                "slots": {
                  "component": "radio-lines"
                }
              }
            }
          }
        }
      },
      {
        key: "reason",
        header: "פירוט סיבת הבקשה",
        title: "יש לפרט את סיבת הבקשה [חובה]",
        schema: {
          "type": "object",
          "required": ["description"],
          "properties": {
            "description": {
              "type": "string",
              "title": "פרוט הפנייה",
              "layout": {
                "props": {
                  "maxLength": 1000
                },
                "slots": {
                  "component": "textarea"
                }
              }
            }
          }
        }
      },
      {
        key: "attachingFiles_shortExtend",
        header: "צירוף קבצים",
        title: "קבצים שחובה לצרף",
        schema: {
          "type": "object",
          "required": ["gradeSheet", "studyProgram"],
          "properties": {
            "gradeSheet": {
              "title": "גליון ציונים עדכני",
              "description":
                "תכנית לימודים בקובץ WORD מהסמסטר הנוכחי עד הסמסטר דח”ש בהנחה ויאושר בתכנית יש לפרט את שמות הקורסים והנ”ז של כל אחד מהם",
              "type": "object",
              "slots": {
                "component": "file-require"
              }
            },
            "studyProgram": {
              "title": "תוכנית לימודים מעודכנת",
              "type": "object",
              "slots": {
                "component": "file-require"
              }
            },
            "medicine": {
              "title": "רפואה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "economy": {
              "title": "כלכלה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "education": {
              "title": "השכלה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "other": {
              "title": "אחר",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            }
          }
        }
      },
      {
        key: "attachingFiles_changeStudy",
        header: "צירוף קבצים",
        title: "קבצים שחובה לצרף",
        schema: {
          "type": "object",
          "required": ["gradeSheet", "studyProgram", "receiptDocument"],
          "properties": {
            "gradeSheet": {
              "title": "גליון ציונים עדכני",
              "description":
                "תכנית לימודים בקובץ WORD מהסמסטר הנוכחי עד הסמסטר דח”ש בהנחה ויאושר בתכנית יש לפרט את שמות הקורסים והנ”ז של כל אחד מהם",
              "type": "object",
              "slots": {
                "component": "file-require"
              }
            },
            "studyProgram": {
              "title": "תוכנית לימודים מעודכנת",
              "type": "object",
              "slots": {
                "component": "file-require"
              }
            },
            "receiptDocument": {
              "title": "מסמך קבלה רשמי ממוסד הלימודים",
              "type": "object",
              "slots": {
                "component": "file-require"
              }
            },
            "medicine": {
              "title": "רפואה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "economy": {
              "title": "כלכלה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "education": {
              "title": "השכלה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "other": {
              "title": "אחר",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            }
          }
        }
      },
      {
        key: "attachingFiles_leaveStudy",
        header: "צירוף קבצים",
        title: "קבצים שחובה לצרף",
        schema: {
          "type": "object",
          "required": ["gradeSheet"],
          "properties": {
            "gradeSheet": {
              "title": "גליון ציונים עדכני",
              "description":
                "תכנית לימודים בקובץ WORD מהסמסטר הנוכחי עד הסמסטר דח”ש בהנחה ויאושר בתכנית יש לפרט את שמות הקורסים והנ”ז של כל אחד מהם",
              "type": "object",
              "slots": {
                "component": "file-require"
              }
            },
            "medicine": {
              "title": "רפואה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "economy": {
              "title": "כלכלה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "education": {
              "title": "השכלה",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            },
            "other": {
              "title": "אחר",
              "type": "array",
              "slots": {
                "maxItems": 5,
                "component": "file-not-require"
              }
            }
          }
        }
      },
      {
        key: "selectInstitution",
        header: "מוסד לימודים מבוקש",
        description: "יש להקליד את מוסד הלימודים בו תרצו ללמוד",
        schema: {
          "type": "object",
          "required": ["institution"],
          "properties": {
            "institution": {
              "type": "string",
              "layout": {
                "props": {
                  "data": "${university}"
                },
                "slots": {
                  "component": "select"
                }
              }
            }
          }
        }
      },
      {
        key: "selectEndDate_dropdown",
        header: "תאריך סיום לימודים מבוקש",
        title: "בחירת שנה ותאריך",
        description:
          "יש לבחור תאריך סיום לימודים, צריך לכתוב אם יש מגבלות או טקסט אחר",
        schema: {
          "type": "object",
          "required": ["year", "semester"],
          "properties": {
            "year": {
              "type": "string",
              "title": "שנת לימודים אקדמית",
              "layout": {
                "props": {
                  "title": "בחירת השנה",
                  "data": "${next3Years}"
                },
                "slots": {
                  "component": "dropdown"
                }
              }
            },
            "semester": {
              "type": "string",
              "title": "בחירת סמסטר אחרון",
              "layout": {
                "props": {
                  "data": ["חורף", "אביב"]
                },
                "slots": {
                  "component": "radio-lines"
                }
              }
            }
          }
        }
      },
      {
        key: "selectMajor",
        header: "מגמה מבוקשת",
        description: "יש לבחור את המגמה בה תרצו ללמוד",
        schema: {
          "type": "object",
          "required": [],
          "properties": {
            "mainMajorType": {
              "type": "string",
              "layout": {
                "props": {
                  "data": ["מגמה ראשית"]
                },
                "slots": {
                  "component": "checkbox"
                }
              }
            },
            "mainMajorOption": {
              "type": "string",
              "layout": {
                "props": {
                  "title": "בחירת המגמה",
                  "data": "${major}"
                },
                "slots": {
                  "component": "dropdown"
                }
              }
            },
            "secondMajorType": {
              "type": "string",
              "layout": {
                "props": {
                  "data": ["מגמה משנית"]
                },
                "slots": {
                  "component": "checkbox"
                }
              }
            },
            "secondMajorOption": {
              "type": "string",
              "layout": {
                "props": {
                  "title": "בחירת המגמה",
                  "data": "${major}"
                },
                "slots": {
                  "component": "dropdown"
                }
              }
            }
          }
        }
      }
    ]
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
