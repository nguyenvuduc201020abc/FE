import { HomeOutlined, MailOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input, message, Spin } from 'antd'
import axios from 'axios'
import { useAtom } from 'jotai'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import React, { memo, useState } from 'react'
import { apiLogin } from '../../../api/authAPI'
import { BASE_URL } from '../../../api/requet'
import { UrlPath } from '../../../type/urlPath'
import { loadingAtom, updateAccountAtom, userAtom } from '../../atom/store'
import PasswordIcon from '../../icons/passwordIcon'
import { StyledButtonPressedEffect } from '../../styled/styledListOfDevice/styledComponent'

const FormLogin = () => {
  const [, setUser] = useAtom(userAtom)
  const [userNameTemp, setUserNameTemp] = useState('')
  const [passwordTemp, setPasswordTemp] = useState('')
  const [emailTemp, setEmailTemp] = useState('')
  const [isForgotPassword, setIsForgotPassword] = useState(true)
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()
  const [isLoading, setIsLoading] = useAtom(loadingAtom)
  const [, setAccount] = useAtom(updateAccountAtom)
  const handleSubmitLogin = () => {
    setIsLoading(true)
    const dataReq = {
      username: userNameTemp,
      password: passwordTemp
    }
    apiLogin(dataReq)
      .then((res) => {
        Cookies.set('jwt_token', res.data.accessToken, { expires: 7 })
        router.push(UrlPath.home.url)

        setUser({
          username: userNameTemp,
          password: passwordTemp
        })
        setAccount({
          role: res.data.role
        })

        //luu gia tri id ng dung len cookie

        Cookies.set('username', userNameTemp, { expires: 7 })
        Cookies.set('role', res.data.role, { expires: 7 })
        Cookies.set('parkingCode', res.data.parkingCode, { expires: 7 })

        const metaViewport = document.querySelector('meta[name="viewport"]')
        metaViewport.setAttribute(
          'content',
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
        )
      })
      .catch(() => {
        setIsLoading(false)
        message.error('Sai thông tin đăng nhập')
      })
  }
  const onFinish = (values) => {
    console.log('Success:', values)
  }
  const onFinishFailed = (errorInfo) => {}
  const handleForgotPassword = () => {
    setIsForgotPassword(false)
    setIsLogin(true)
  }
  const handleLogin = () => {
    setIsForgotPassword(true)
    setIsLogin(false)
  }
  const handleSubmitForgotPassword = async () => {
    setIsLoading(true)
    await axios
      .post(`${BASE_URL}email/fogotPassWord`, { toEmail: emailTemp })
      .then(() => {
        message.info('Success - Check Email')
        setIsLoading(false)
      })
      .catch((error) => {
        message.error(error.response.data.message)
        setIsLoading(false)
      })
  }

  return (
    <>  
      <Spin size="large" spinning={isLoading}>
        <Form
          name="basic"
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          style={{ textAlign: 'center' }}
        >
          <Form.Item
            colon="false"
            hidden={isLogin}
            name="account"
            rules={[
              {
                required: true,
                message: ' Nhâp Tài Khoản'
              }
            ]}
          >
            <Input
              value={userNameTemp}
              placeholder="Tài Khoản"
              onChange={(e) => setUserNameTemp(e.target.value)}
              prefix={<UserOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            hidden={isLogin}
            rules={[
              {
                required: true,
                message: ' Nhâp Mật Khẩu !'
              }
            ]}
          >
            <Input.Password
              value={passwordTemp}
              placeholder="Mật Khẩu"
              onChange={(e) => setPasswordTemp(e.target.value)}
              prefix={<PasswordIcon />}
            />
          </Form.Item>

          <Form.Item
            name="remember"
            hidden={isLogin}
            valuePropName="checked"
            layout="vertical"
          >
            <Checkbox>Remember Me</Checkbox>
          </Form.Item>

          <Form.Item
            colon="false"
            name="forgotPassword"
            hidden={isForgotPassword}
            rules={[
              {
                required: true,
                message: ' Nhâp Email'
              },
              {
                pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Email không hợp lệ '
              }
            ]}
          >
            <Input  
              value={emailTemp}
              placeholder="Email"
              onBlur={(e) => setEmailTemp(e.target.value)}
              prefix={<MailOutlined />}
            />
          </Form.Item>

          {/* <Form.Item hidden={isLogin}>
            <Button onClick={handleForgotPassword}>Quên Mật Khẩu</Button>
          </Form.Item> */}

          <Form.Item hidden={isLogin}>
            <StyledButtonPressedEffect
              type="primary"
              htmlType="submit"
              onClick={handleSubmitLogin}
            >
              Đăng nhập
            </StyledButtonPressedEffect>
          </Form.Item>

          <Form.Item hidden={isForgotPassword}>
            <Button onClick={handleLogin}>Đăng Nhập</Button>
          </Form.Item>
          <Form.Item hidden={isForgotPassword}>
            <StyledButtonPressedEffect
              type="primary"
              htmlType="submit"
              onClick={handleSubmitForgotPassword}
            >
              Lấy mật khẩu
            </StyledButtonPressedEffect>
          </Form.Item>
        </Form>
      </Spin>
    </>
  )
}

export default memo(FormLogin)
