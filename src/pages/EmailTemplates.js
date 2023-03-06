import { useState } from "react";
import Header from "../components/Header";
import Layout from "../components/Layout";

export default function EmailTemplates() {
  const [newTemplateBody, setNewTemplateBody] = useState(null);
  const [newTemplateName, setNewTemplateName] = useState(null);
  // const [templates, setTemplates] = useState([]);

  const templates = [
    {
      id: 1,
      name: "My Template 1",
      body: "This is an example email template",
    },
    {
      id: 2,
      name: "My Template 2",
      body: "This is an example email template 2 with a variable <HERO>",
    },
  ];

  const user = {
    username: "Basil",
    email: "basil@example.com",
    id: 1,
  };

  const handleCreateNewTemplateSubmit = () => {
    console.log("create new template!");
  };

  return (
    <>
      <Header user={user} />
      <Layout>
        <div>
          <p class="fw-bold fs-4">Email Templates</p>
        </div>

        <div class="my-3 fw-bold">Create new template</div>
        <div class="my-3">
          <label for="templateName" class="form-label">
            Template name
          </label>
          <input
            type="text"
            class="form-control"
            id="templateName"
            placeholder="My Email Template"
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
          />
        </div>

        <div class="my-3 text-end">
          <button
            class="btn btn-primary"
            onClick={() => handleCreateNewTemplateSubmit}
          >
            Submit
          </button>
        </div>

        <hr />

        <div class="my-3 fw-bold">Saved templates</div>

        <div class="my-3">
          {templates && (
            <div class="accordion" id="templates-accordion">
              {templates.map((t, index) => (
                <div class="accordion-item">
                  <h2 class="accordion-header" id={`template-header-${index}`}>
                    <button
                      class={`accordion-button ${
                        index !== 0 ? "collapsed" : ""
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
                      class={`accordion-collapse collapse ${
                        index === 0 ? "show" : ""
                      }`}
                      aria-labelledby={`template-header-${index}`}
                      data-bs-parent="#templates-accordion"
                    >
                      <div class="accordion-body
                      ">
                        <p>{t.body}</p>
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
