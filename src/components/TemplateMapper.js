import { useEffect, useState } from "react";
import { getTemplateNames } from "../utils/api";

export default function TemplateMapper({ purposes }) {
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
        <table class="w-100 text-center">
          <thead class="text-center">
            <th>Purpose</th>
            <th>Template</th>
          </thead>
          <tbody>
            {purposes.map((p) => (
              <tr>
                <td>{p}</td>
                <td>
                  <select
                    class="form-select"
                    aria-label="Template select"
                  >
                    <option value="None">None</option>
                    {templates && templates.map((t, index) => (
                      <option value={t._id}>{t.name}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
      </div>
    </>
  );
}
