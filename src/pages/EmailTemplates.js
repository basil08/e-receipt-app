import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Layout from "../components/Layout";
import loginGuard from "../utils/loginguard";
import { createNewEmailTemplate, deleteTemplate, getEmailTemplates } from "../utils/api";

import { MdDelete } from 'react-icons/md';

export default function EmailTemplates() {
  useEffect(loginGuard(useNavigate()), []);

  const [newTemplateBody, setNewTemplateBody] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [templateCount, setTemplateCount] = useState(0);

  useEffect(() => {
    getEmailTemplates().then(e => {
      setTemplates(e.message.templates);
      setTemplateCount(e.message.templates.length);
    })
  }, [templateCount]);

  const handleCreateNewTemplateSubmit = () => {

    createNewEmailTemplate(newTemplateName, newTemplateBody).then((e) => {
      if (!e.error) {
        console.log("created new template");
      }

      console.log(e.message);
    })
  };

  const handleDeleteTemplate = (id) => {
    deleteTemplate(id).then(e => {
      if (!e.error) {
        console.log(e.message);
        window.alert("Email template deleted!");
        setTemplateCount(templateCount - 1);
      }
    })

  }
  return (
    <>
      <Header />
      <Layout>
        <div>
          <p class="fw-bold fs-4">Email Templates</p>
        </div>

        <div class="my-3 fw-bold">Create new template</div>
        <form>

          <div class="my-3">
            <label for="templateName" class="form-label">
              Template name
            </label>
            <input
              type="text"
              class="form-control"
              id="templateName"
              placeholder="My Email Template"
              onChange={(e) => setNewTemplateName(e.target.value)}
            />
          </div>

          <div class="my-3">
            <label for="templateBody" class="form-label">
              Body
            </label>
            <textarea
              type="text"
              class="form-control"
              id="templateBody"
              rows="12"
              placeholder="My Email Body"
              onChange={(e) => setNewTemplateBody(e.target.value)}
            />
          </div>

          <div class="my-3 text-end">
            <button
              class="btn btn-primary"
              onClick={(e) => handleCreateNewTemplateSubmit()}
            >
              Submit
            </button>
          </div>
        </form>

        <hr />

        <div class="my-3 fw-bold">Saved templates</div>

        <div class="my-3">
          {templates && (
            <div class="accordion" id="templates-accordion">
              {templates.map((t, index) => (
                <div class="accordion-item" key={index}>
                  <h2 class="accordion-header" id={`template-header-${index}`}>
                    <button
                      class={`accordion-button ${index !== 0 ? "collapsed" : ""
                        }`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${index}`}
                      aria-expanded="false"
                      aria-controls={`#collapse-${index}`}
                    >
                      {t.name}
                    </button>
                    <div
                      id={`collapse-${index}`}
                      class={`accordion-collapse collapse ${index === 0 ? "show" : ""
                        }`}
                      aria-labelledby={`template-header-${index}`}
                      data-bs-parent="#templates-accordion"
                    >
                      <div class="accordion-body
                      ">
                        <div className="row justify-content-end">
                          <div className="col text-end">
                            <button className="btn" onClick={() => handleDeleteTemplate(t._id)}>
                              <MdDelete />
                            </button>

                          </div>
                        </div>
                        <div className="row">
                          <p className="fs-5">{t.body}</p>
                        </div>
                      </div>
                    </div>
                  </h2>
                </div>
              ))}
            </div>
          )}
          {templates.length <= 0 && <div>No saved templates in database!</div>}
          {!templates && (
            <div class="spinner-border m-5" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </Layout>
    </>
  );
}
