import { post } from "@/services/http"

type loginInfo = {
    username: string,
    password: string
}
export const loginUsera = (info: loginInfo) => {
    post('/user/login', info)
}
