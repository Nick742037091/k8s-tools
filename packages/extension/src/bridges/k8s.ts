import axios from 'axios'
import { window } from 'vscode'
import { createFiles } from './files'

const creator = '81000775'
// 企业空间
const cooperationSpace = 'mh-web'
// 集群
const clusterMap: Record<string, string> = {
  uat: 'sim-1',
  prd: 'prd-1'
}
// 流水线项目名称
const devopsNameMap: Record<string, string> = {
  uat: 'sim-devops',
  prd: 'prd-devops'
}
// 流水线项目名称(添加hash后缀)
const devopsNamespaceMap: Record<string, string> = {
  uat: 'sim-devops7gt5b',
  prd: 'prd-devopsdtq4n'
}
// git 凭证
const gitCredential = 'gitlab-account'
// jenkins 文件路径
const jenkinsFilePathMap: Record<string, string> = {
  uat: 'deploy/Jenkinsfile-uat',
  prd: 'deploy/Jenkinsfile-prd'
}

const clusterIPMap: Record<string, string> = {
  uat: '10.255.242.10', // 10.255.242.10~10.255.242.19
  prd: '10.255.243.30' // 10.255.243.30~10.255.243.38
}

const api = axios.create({
  baseURL: 'http://host-kslb.mh.bluemoon.com.cn'
})

// 检测项目是否存在
async function checkProjectExist(env: string, projectName: string) {
  const cluster = clusterMap[env]
  const response = await api.get(
    `/api/clusters/${cluster}/v1/namespaces/${projectName}`,
    {
      headers: {
        'x-check-exist': true
      }
    }
  )
  return response.data.exist
}

// 检测流水线是否存在
async function checkPipelineExist(env: string, projectName: string) {
  const cluster = clusterMap[env]
  const devopsNamespace = devopsNamespaceMap[env]
  const response = await api.get(
    `/kapis/clusters/${cluster}/devops.kubesphere.io/v1alpha3/devops/${devopsNamespace}/pipelines/${projectName}`,
    {
      headers: {
        'x-check-exist': true
      }
    }
  )
  return response.data.exist
}
// 创建项目
async function createProject(env: string, projectName: string) {
  const cluster = clusterMap[env]
  const response = await api.post(
    `/kapis/clusters/${cluster}/tenant.kubesphere.io/v1alpha2/workspaces/${cooperationSpace}/namespaces`,
    {
      apiVersion: 'v1',
      kind: 'Namespace',
      metadata: {
        name: projectName,
        labels: {
          'kubesphere.io/workspace': cooperationSpace
        },
        annotations: {
          'kubesphere.io/creator': creator
        }
      },
      cluster
    }
  )
  return response.data
}

// 创建服务
async function createService(env: string, projectName: string) {
  const cluster = clusterMap[env]
  const response = await api.post(
    `/api/clusters/${cluster}/v1/namespaces/${projectName}/services`,
    {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        namespace: projectName,
        labels: { version: 'v1', app: `${projectName}-service` },
        annotations: {
          'kubesphere.io/serviceType': 'statelessservice',
          'kubesphere.io/creator': creator
        },
        name: `${projectName}-service`
      },
      spec: {
        sessionAffinity: 'None',
        selector: { app: `${projectName}-service` },
        template: {
          metadata: { labels: { version: 'v1', app: `${projectName}-service` } }
        },
        ports: [{ name: 'tcp-80', protocol: 'TCP', port: 80, targetPort: 80 }],
        type: 'NodePort'
      }
    }
  )
  return response.data
}

// 创建Deployment
async function createDeployment(env: string, projectName: string) {
  const cluster = clusterMap[env]
  const response = await api.post(
    `/apis/clusters/${cluster}/apps/v1/namespaces/${projectName}/deployments`,
    {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        namespace: projectName,
        labels: { version: 'v1', app: `${projectName}-service` },
        name: `${projectName}-service-v1`,
        annotations: { 'kubesphere.io/creator': creator }
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: { version: 'v1', app: `${projectName}-service` }
        },
        template: {
          metadata: {
            labels: { version: 'v1', app: `${projectName}-service` }
          },
          spec: {
            containers: [
              {
                name: `${projectName}-container`,
                imagePullPolicy: 'IfNotPresent',
                image: 'harbor.bluemoon.com.cn/baseimage/nginx-alpine:v0.0.1',
                ports: [
                  {
                    name: 'tcp-80',
                    protocol: 'TCP',
                    containerPort: 80,
                    servicePort: 80
                  }
                ]
              }
            ],
            serviceAccount: 'default',
            affinity: {},
            initContainers: [],
            volumes: [],
            imagePullSecrets: null
          }
        },
        strategy: {
          type: 'RollingUpdate',
          rollingUpdate: { maxUnavailable: '25%', maxSurge: '25%' }
        }
      }
    }
  )
  return response.data
}

// 创建流水线
async function createPipeline(
  env: string,
  projectName: string,
  gitUrl: string,
  gitBranch: string
) {
  const cluster = clusterMap[env]
  const devopsName = devopsNameMap[env]
  const devopsNamespace = devopsNamespaceMap[env]
  const jenkinsFilePath = jenkinsFilePathMap[env]
  const response = await api.post(
    `kapis/clusters/${cluster}/devops.kubesphere.io/v1alpha3/devops/${devopsNamespace}/pipelines`,
    {
      devopsName: devopsName,
      metadata: {
        name: projectName,
        namespace: devopsNamespace,
        annotations: {
          'kubesphere.io/creator': creator
        }
      },
      spec: {
        multi_branch_pipeline: {
          source_type: 'git',
          git_source: {
            url: gitUrl,
            credential_id: gitCredential,
            discover_branches: true,
            git_clone_option: {
              depth: 1,
              timeout: 20
            },
            regex_filter: gitBranch
          },
          discarder: {
            days_to_keep: '-1',
            num_to_keep: '-1'
          },
          script_path: jenkinsFilePath,
          timer_trigger: {
            // 1分钟扫描一次
            interval: '60000'
          },
          devopsName: devopsName,
          cluster,
          devops: devopsNamespace,
          enable_timer_trigger: true,
          enable_discarder: true,
          name: projectName,
          enable_regex_filter: true
        },
        type: 'multi-branch-pipeline'
      },
      kind: 'Pipeline',
      apiVersion: 'devops.kubesphere.io/v1alpha3'
    }
  )
  return response.data
}
export async function createK8S(
  token: string,
  env: string,
  projectName: string,
  gitUrl: string,
  gitBranch: string
) {
  try {
    api.defaults.headers.common['Content-Type'] = 'application/json'
    api.defaults.headers.common['Cookie'] = `token=${token}`
    createFiles(env, projectName)
    // 检查项目是否存在
    const exist = await checkProjectExist(env, projectName)
    if (exist) {
      window.showErrorMessage(`项目 ${projectName} 已存在`)
      return
    }
    // 检查流水线是否存在
    const pipelineExist = await checkPipelineExist(env, projectName)
    if (pipelineExist) {
      window.showErrorMessage(`流水线 ${projectName} 已存在`)
      return
    }
    // 创建项目
    await createProject(env, projectName)
    // 创建服务
    const createServiceResponse = await createService(env, projectName)
    // 创建 Deployment
    await createDeployment(env, projectName)
    // 创建流水线
    await createPipeline(env, projectName, gitUrl, gitBranch)
    const clusterIP = clusterIPMap[env]
    const cluster = clusterMap[env]
    const devopsNamespace = devopsNamespaceMap[env]
    const pageUrl = `http://${clusterIP}:${createServiceResponse.spec.ports[0].nodePort}/FE/${projectName}/`
    const pipelineUrl = `http://host-kslb.mh.bluemoon.com.cn/${cooperationSpace}/clusters/${cluster}/devops/${devopsNamespace}/pipelines/${projectName}/branch/${gitBranch}/activity`
    return {
      pageUrl,
      pipelineUrl
    }
  } catch (error: any) {
    window.showErrorMessage(`创建失败: ${error?.message || '未知错误'}`)
  }
}
