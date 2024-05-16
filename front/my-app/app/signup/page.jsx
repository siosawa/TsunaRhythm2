import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const SignUp = () => {
    return (
  <>
      <div className="container shadow-lg p-10 max-w-72 flex flex-col items-center space-y-3 fixed top-20 right-0 lg:right-10 2xl:right-72 my-10 mx-10 rounded-2xl">
      <p></p>
      <h1 className="text-4xl">新規作成</h1>
      <p></p>
      <Input placeholder="メールアドレス"/>
      <Input placeholder="パスワード"/>
      <Input placeholder="確認用パスワード"/>
      <Button className="bg-emerald-500 text-white shadow-lg hover:bg-emerald-700 w-full">アカウントを新規作成</Button>
      <p></p>
      </div>
      </>
    )
  }

export default SignUp