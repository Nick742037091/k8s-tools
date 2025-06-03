import { writeFile, readFile, readdir, mkdir } from 'fs/promises';
import handlebars from 'handlebars';
import path from 'path';
import { workspace } from 'vscode';

export const createFiles = async (env: string, projectName: string) => {
  try {
    // 读取插件目录下的所有文件
    const templateDir = path.join(__dirname, 'template');
    const files = await readdir(templateDir);

    // 遍历所有文件并处理
    for (const file of files) {
      await createFileWithHandlebars(file, {
        env,
        projectName
      });
    }
  } catch (error) {
    console.error('处理文件失败：', error);
  }
};

async function createFileWithHandlebars(
  templateFile: string,
  variables: Record<string, string>
) {
  try {
    const templateContent = await readFile(
      path.join(__dirname, 'template', templateFile),
      'utf-8'
    );

    // 编译模板
    const template = handlebars.compile(templateContent);

    // 渲染内容
    const content = template(variables);

    // 获取运行插件的项目根目录
    const targetDir = path.join(
      workspace.workspaceFolders?.[0]?.uri.fsPath || '',
      'deploy'
    );
    let targetFile = path.join(targetDir, templateFile);
    if (templateFile === 'Jenkinsfile') {
      targetFile += `-${variables.env}`;
    }

    // 确保目录存在
    await mkdir(targetDir, { recursive: true });

    // 写入文件
    await writeFile(targetFile, content, 'utf-8');
  } catch (error) {
    console.error('创建文件失败：', error);
  }
}
