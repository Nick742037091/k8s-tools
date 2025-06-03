import { Modal } from 'antd'
import { useState } from 'react'
import { nativeCommond } from '@/utils/bridge'

interface ResultModalProps {
  pageUrl: string
  pipelineUrl: string
  env: string
  projectName: string
}

const clusterIPsMap: Record<string, string> = {
  uat: '10.255.242.10 ~ 10.255.242.19',
  prd: '10.255.243.30 ~ 10.255.243.38'
}

export const useResultModal = () => {
  const [visible, setVisible] = useState(false)
  const [result, setResult] = useState<ResultModalProps | null>(null)

  const openUrl = (url: string | undefined) => {
    if (!url) return
    nativeCommond({
      command: 'openUrl',
      params: {
        url
      }
    })
  }

  const open = (props: ResultModalProps) => {
    setResult(props)
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const ResultModal = () => {
    if (!visible) return null

    return (
      <Modal
        title={
          <div className="text-[20px] font-medium text-gray-800">配置成功</div>
        }
        style={{
          top: '10vh'
        }}
        open={visible}
        onCancel={close}
        onOk={close}
        cancelButtonProps={{
          style: {
            display: 'none'
          }
        }}
        okText="关闭"
        okButtonProps={{
          className: 'bg-blue-500 hover:bg-blue-600'
        }}
        width={700}
        className="custom-modal"
        destroyOnHidden={false}
      >
        <div className="space-y-6 p-[10px] max-h-[60vh] overflow-y-auto">
          <div className="text-[15px] text-gray-600 bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex flex-col">
            <div className="flex items-center items-center flex-wrap">
              <span className="text-yellow-500 mr-[4px] mb-[2px]">⚠️</span>
              <span className="text-yellow-600 font-medium">提示：</span>
            </div>
            <div className="mt-[10px]">
              已创建k8s项目和流水线，并在
              <span className="font-bold text-blue-500"> deploy </span>
              目录中创建了部署文件，以下步骤需手动操作
            </div>

            <div className="mt-[6px]">
              1. 修改项目的
              <span className="font-bold text-blue-500"> baseUrl </span>为
              <span className="font-bold text-blue-500">
                {` FE/${result?.projectName} `}
              </span>
            </div>
            <div className="mt-[6px]">
              2. 在Jenkinsfile-{result?.env}文件
              <span className="font-bold text-blue-500"> 构建文件 </span>
              步骤中调整构建命令
            </div>
            <div className="mt-[6px]">
              3. 提交部署文件，并合并到构建分支中，k8s会检测分支更新并自动部署。
            </div>
            <div className="font-bold mt-[12px] text-red-500">
              若提交部署文件之前，仓库中已存在构建分支，会触发一次失败的构建，无需理会。
            </div>
          </div>

          <div>
            <div className="text-[16px] font-medium text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              页面链接（部署成功才能访问）
            </div>
            <div className="flex flex-col gap-2">
              <div
                className="text-blue-500 hover:text-blue-800 underline cursor-pointer break-all bg-gray-50 px-3 py-1 rounded border border-gray-200 hover:border-blue-300 transition-all"
                onClick={() => openUrl(result?.pageUrl)}
              >
                {result?.pageUrl}
              </div>
            </div>
            {result?.env && (
              <div className="text-gray-500 text-[14px] mt-2">
                集群IP范围：{clusterIPsMap[result?.env]}，任一IP均可访问
              </div>
            )}
          </div>

          <div>
            <div className="text-[16px] font-medium text-gray-800 mb-3 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              流水线链接
            </div>
            <div
              className="text-blue-500 hover:text-blue-800 underline cursor-pointer bg-gray-50 p-3 rounded border border-gray-200 hover:border-blue-300 transition-all"
              onClick={() => openUrl(result?.pipelineUrl)}
            >
              {result?.pipelineUrl}
            </div>
          </div>
        </div>
      </Modal>
    )
  }

  return {
    ResultModal,
    open
  }
}
