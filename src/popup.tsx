import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button, Select, Spin } from 'antd';
import { Message, MessageResponse, MessageType, Projects } from './types';
import 'normalize.css';
import './styles/index.less';
import { visitAPMS } from './utils';

const APP: React.FC = () => {
  const [message, setMessage] = React.useState('');
  const [messageDetail, setMessageDetail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [project, setProject] = React.useState<Projects>(Projects.OPS);
  const projectOptions = (Object.values(Projects)).map(i => ({ label: i, value: i }));

  const updateMdapCookie = () => {
    setLoading(true);
    chrome.runtime.sendMessage<Message, MessageResponse>({
      type: MessageType.UPDATE_MDAP_COOKIE,
    }, response => {
      setLoading(false);
      if (response?.retcode !== 0) {
        setMessage(response?.body?.message || 'somthing wrong');
        setMessageDetail(response?.body?.detail || '');
        return;
      }
      setMessage('update cookie success!');
      setMessageDetail('');
    });
  };

  const updateProject = (project: Projects) => {
    setLoading(true);
    chrome.runtime.sendMessage<Message, MessageResponse>({
      type: MessageType.UPDATE_PROJECT,
      data: {
        project,
      },
    }, response => {
      setLoading(false);
      if (response?.retcode !== 0) {
        setMessage(response?.body?.message || 'somthing wrong');
        setMessageDetail(response?.body?.detail || '');
        return;
      }
      setMessage('update project success!');
      setMessageDetail('');
    });
  };

  const sendReport = () => {
    setLoading(true);
    chrome.runtime.sendMessage<Message, MessageResponse>({
      type: MessageType.SEND_REPORT,
    }, response => {
      setLoading(false);
      if (response?.retcode !== 0) {
        setMessage(response?.body?.message || 'somthing wrong');
        setMessageDetail(response?.body?.detail || '');
        return;
      }
      setMessage(`pipline is running at: ${response?.body?.web_url}`);
      setMessageDetail('');
    });
  };

  return (
    <>
      <div>
        <Button
          type="primary"
          onClick={updateMdapCookie}
        >
          Update MDAP Cookie
        </Button>
        &nbsp;&nbsp;
        <Button onClick={visitAPMS}>Login APMS</Button>
        <br />
        <br />
        <Select
          options={projectOptions}
          value={project}
          onChange={setProject}
          dropdownMatchSelectWidth={false}
        />
        &nbsp;&nbsp;
        <Button
          type="primary"
          onClick={() => updateProject(project)}
        >
          Update Project
        </Button>
        <br />
        <br />
        <Button
          type="primary"
          onClick={sendReport}
        >
          Send Report
        </Button>
      </div>
      <br />
      <div>
        {loading ? <Spin size="small" style={{ marginLeft: 8 }} /> : null}
        {loading ? null : message}
      </div>
      <br />
      <pre>{loading ? null : messageDetail}</pre>
    </>
  );
};

createRoot(document.querySelector('#root') as HTMLElement).render(<APP />);

if (module.hot) {
  module.hot.accept();
}
