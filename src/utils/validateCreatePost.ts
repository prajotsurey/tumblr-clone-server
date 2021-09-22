import { validateOutput } from "./validateRegister";

export const validateCreatePost = (title: string, text: string): validateOutput[] | null => {
  //passwords aren't long enough
  if(text.length < 1){
    return[
      {
        field: "text",
        message: "must be longer than 1"
      }
    ]
  }
  //username isn't long enough
  if(title.length < 1){
    return[
      {
        field: "title",
        message: "must be longer than 1"
      }
    ]
  }
  return null
}
