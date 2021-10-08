import { validateOutput } from "./validateRegister";

export const validateCreatePost = (title: string, text: string): validateOutput[] | null => {
  //passwords aren't long enough
  if(text.length < 1){
    return[
      {
        field: "text",
        message: "Text is missing"
      }
    ]
  }
  //username isn't long enough
  if(title.length < 1){
    return[
      {
        field: "title",
        message: "Title is missing"
      }
    ]
  }
  return null
}
