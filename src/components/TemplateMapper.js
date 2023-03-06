import { useEffect, useState } from "react";

export default function TemplateMapper({ purposes }) {
  // const [templates, setTemplates] = useState([]);

  // mock templates array
  const templates = [
    'Generic Email Template',
    'Ninja template 1',
    'Golden Donor Template',
    'Robin Hood donor special template'
  ];

  // useEffect(() => {
  // }, []);

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
                    {templates.map((t, index) => (
                      <option value={index}>{t}</option>
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
