import { useEffect, useState } from "react";
import { getTemplateNames } from "../utils/api";

export default function TemplateMapper({ purposes, computeTemplateMapping, handleTemplateMappingChange, handleDefaultTemplateChange }) {
  const [templates, setTemplates] = useState([]);

  useEffect(() => {
    getTemplateNames().then((e) => {
      if (!e.error) {
        setTemplates(e.message);
      }
    })

  }, []);

  return (
    <>
      <div class="p-3">
        <div class="my-3">
          <label htmlFor="genericTemplate">Generic Template</label>
          <select
            class="form-select"
            id="genericTemplate"
            aria-label="Template select"
            onChange={(e) => handleDefaultTemplateChange(e.target.value)}
          >
            <option value={"None"}>None</option>
            {templates && templates.map((t, index) => (
              <option key={index} value={t._id}>{t.name}</option>
            ))}
          </select>
        </div>

        <div className="my-2 text-muted small">
          If you leave the template value as "None", then the generic template is used.
        </div>

        <table class="w-100 text-center">
          <thead class="text-center">
            <th>Purpose</th>
            <th>Template</th>
          </thead>
          <tbody>
            {purposes.map((p, index) => (
              <tr>
                <td>{p}</td>
                <td>
                  <select
                    key={index}
                    id={`${p}`}
                    class="form-select"
                    aria-label="Template select"
                    onChange={(e) => handleTemplateMappingChange(p, e.target.value)}
                  >
                    <option value="None">None</option>
                    {templates && templates.map((t, index) => (
                      <option key={index} value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div class="my-1">
          <button className="btn btn-primary" onClick={() => computeTemplateMapping()}>Done</button>
        </div>

      </div>
    </>
  );
}
