import { Gitlab } from '@gitbeaker/browser';
import { Projects } from './types';
import { visitAPMS } from './utils';

declare const __REPO_ID__: number;
declare const __GITLAB_DOMAIN__: string;
declare const __GITLAB_TOKEN__: string;

const gitlabDomain = __GITLAB_DOMAIN__;
const token = __GITLAB_TOKEN__;
const gitAPI = new Gitlab({
  host: gitlabDomain,
  token,
});

function getMdapCookie() {
  const whitelist = {
    '__mdap_session_token__': true,
    '_oauth2_proxy_mesos': true,
    // 'ssc_skey': true,
    '_mdap_locale_language_': true,
  };
  return new Promise<string>((resolve) => {
    chrome.cookies.getAll({
      domain: '.shopee.io',
    }, function (cookies) {
      if (!cookies) {
        return resolve('');
      }
      const cookieValue = (cookies || [])
        .filter(item => whitelist[item.name as keyof typeof whitelist])
        .map(item => `${item.name}=${item.value}`).join('; ');
      resolve(cookieValue);
    });
  });
}

export function getMdapCookieFromCIVars() {
  return gitAPI.ProjectVariables.show(__REPO_ID__, 'mdap_user_cookie');
}

export async function updateMdapCookie() {
  return gitAPI.ProjectVariables.edit(__REPO_ID__, 'mdap_user_cookie', {
    value: await getMdapCookie(),
  });
}

export async function updateProject(project: Projects) {
  return gitAPI.ProjectVariables.edit(__REPO_ID__, 'project', {
    value: project,
  });
}

export async function sendReport() {
  return await gitAPI.Triggers.pipeline(__REPO_ID__, 'master', '84e53e36ec427c597d01169bac25a7');
}
// 如果浏览器中的请求 401 了，就触发重新登录
export async function checkMdapCookie() {
  const res = await fetch('https://mapms.shopee.io/api/v1/projects/-/applications/ops/permissions', {
    'headers': {
      'accept': 'application/json',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8',
      'cache-control': 'no-cache',
      'pragma': 'no-cache',
      'sec-ch-ua': '"Not_A Brand";v="99", "Google Chrome";v="109", "Chromium";v="109"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-site',
    },
    'referrer': 'https://apms.shopee.io/',
    'referrerPolicy': 'strict-origin-when-cross-origin',
    'body': null,
    'method': 'GET',
    'mode': 'cors',
    'credentials': 'include',
  });
  if (res.status === 401) {
    // todo: 访问中间页面，在这个页面进行登录
    visitAPMS();
  } else {
    console.log('cookie is valid');
  }
}
