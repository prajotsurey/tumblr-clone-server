import { Response } from "express"

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie(
    'jid',token,
    { 
      httpOnly: true,
      path: "/",
      sameSite: 'none',
      secure: true,
    }
  )
}