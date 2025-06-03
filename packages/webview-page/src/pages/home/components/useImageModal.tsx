import { Image, Modal } from 'antd'
import { useState } from 'react'

export const useImageModal = () => {
  const [visible, setVisible] = useState(false)

  const open = () => {
    setVisible(true)
  }

  const close = () => {
    setVisible(false)
  }

  const ImageModal = () => {
    return (
      <Modal
        title={
          <div className="text-[20px] font-medium text-gray-800">
            获取 k8s token 步骤
          </div>
        }
        open={visible}
        onCancel={close}
        onOk={close}
        footer={null}
        width="95vw"
        style={{ top: '5vh' }}
        styles={{ body: { padding: 0 } }}
      >
        <div className="flex justify-center items-center bg-gray-50">
          <Image
            src="https://mh-aliyun-oss.bluemoon.com.cn//mh-scrm-admin/fMkpRJTeMr.png"
            alt="获取 k8s token 步骤"
            className="max-h-[80vh] object-contain"
            preview={false}
          />
        </div>
      </Modal>
    )
  }

  return {
    ImageModal,
    open
  }
}
