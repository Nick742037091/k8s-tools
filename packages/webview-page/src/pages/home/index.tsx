import { nativeCommond } from '@/utils/bridge'
import { Button, Card, Form, Input, message, Select, Spin } from 'antd'
import { useEffect, useState } from 'react'
import { useResultModal } from './components/useResultModal'
import { useImageModal } from './components/useImageModal'

type FieldType = {
  env: string
  token: string
  projectName: string
  gitUrl: string
  gitBranch: string
}

function HomePage() {
  const [form] = Form.useForm<FieldType>()
  const { ResultModal, open: openResultModal } = useResultModal()
  const { ImageModal, open: openImageModal } = useImageModal()
  const [loading, setLoading] = useState(false)
  const onFinish = async (values: FieldType) => {
    if (!values.token) {
      message.error('请输入k8s token')
      return
    }
    if (!values.projectName) {
      message.error('请输入项目名称')
      return
    }
    if (!values.gitUrl) {
      message.error('请输入git地址')
      return
    }
    if (!values.gitBranch) {
      message.error('请输入构建分支')
      return
    }
    setLoading(true)
    const result = await nativeCommond<{
      data: { pageUrl: string; pipelineUrl: string }
    }>({
      command: 'createK8SConfig',
      params: {
        token: values.token,
        env: values.env,
        projectName: values.projectName,
        gitUrl: values.gitUrl,
        gitBranch: values.gitBranch
      }
    })
    if (!result.data) {
      setLoading(false)
      return
    }
    openResultModal({
      pageUrl: result.data.pageUrl,
      pipelineUrl: result.data.pipelineUrl,
      env: values.env,
      projectName: values.projectName
    })
    setLoading(false)
  }

  const onCancel = () => {
    nativeCommond({
      command: 'closeWebview'
    })
  }

  useEffect(() => {
    form.setFieldsValue({
      token: '',
      env: 'uat',
      projectName: '',
      gitUrl: '',
      gitBranch: 'test'
    })
    const loadData = async () => {
      nativeCommond<{ data: string }>({
        command: 'getProjectName'
      }).then(({ data }) => {
        form.setFieldsValue({
          projectName: data
        })
      })
      nativeCommond<{ data: string }>({
        command: 'getGitUrl'
      }).then(({ data }) => {
        form.setFieldsValue({
          gitUrl: data
        })
      })
    }
    loadData()
    return () => {
      form.resetFields()
    }
  }, [form])

  const handleEnvChange = (value: string) => {
    form.setFieldsValue({
      gitBranch: value === 'uat' ? 'test' : 'main'
    })
  }

  return (
    <div className="bg-black/10 h-[100vh] w-[100vw] box-border p-[20px]">
      <Card title="配置k8s">
        <Spin spinning={loading}>
          <Form
            form={form}
            layout="horizontal"
            onFinish={onFinish}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item label="k8s token" name="token">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="环境" name="env">
              <Select onChange={handleEnvChange}>
                <Select.Option value="uat">测试</Select.Option>
                <Select.Option value="prd">生产</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="项目名称" name="projectName">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="git地址" name="gitUrl">
              <Input allowClear />
            </Form.Item>
            <Form.Item label="构建分支" name="gitBranch">
              <Input allowClear />
            </Form.Item>

            <Form.Item label="注意">
              <div className="leading-[32px]">
                <div>1. 需要连接公司生产VPN</div>
                <div>
                  2. 需要从k8s站点登录后提取token
                  <span
                    className="font-bold text-blue-500 cursor-pointer ml-[10px]"
                    onClick={openImageModal}
                  >
                    查看操作方式
                  </span>
                </div>
                <div>
                  3. 当前配置在
                  <span className="text-blue-500 font-bold"> 月亮小屋 </span>
                  k8s站点的
                  <span className="text-blue-500 font-bold"> mh-web </span>
                  空间，后续将支持选择站点和空间
                </div>
              </div>
            </Form.Item>

            <div className="flex justify-end gap-x-[10px]">
              <Button type="primary" htmlType="submit">
                确定
              </Button>
              <Button type="default" htmlType="button" onClick={onCancel}>
                取消
              </Button>
            </div>
          </Form>
        </Spin>
      </Card>
      <ResultModal />
      <ImageModal />
    </div>
  )
}

export default HomePage
