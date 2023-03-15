import { useState, useEffect } from "react";
import Papa from "papaparse";

import Header from "../components/Header";
import TemplateMapper from "../components/TemplateMapper";
import Layout from "../components/Layout";
import { generateAndSend } from "../utils/api";
import loginGuard from "../utils/loginguard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  useEffect(loginGuard(useNavigate()), []);

  const emailMap = {
    0: null,
    1: "smtp",
    2: "mailchimp",
    3: "sendgrid",
  };

  const [csvFile, setCSVFile] = useState(null);
  const [emailProvider, setEmailProvider] = useState(null);
  const [purposes, setPurposes] = useState([]);
  const [numRecordRead, setNumRecordRead] = useState(5);
  const [numSuccess, setNumSuccess] = useState(3);
  const [numFailures, setNumFailures] = useState(3);
  const [user, setUser] = useState(null);
  const [csvData, setCSVData] = useState([]);
  const [error, setError] = useState('');

  const resetForm = () => {
    setCSVFile(null);
    setEmailProvider(null);
    setPurposes([]);
    setNumRecordRead(null);
    setNumSuccess(null);
    setNumFailures(null);
  };

  const handleGenerateAndSend = () => {
    if (csvData.length <= 0) {
      setError("Please add some data in CSV File before sending receipts!");
    }

    generateAndSend(csvData).then((e) => {
      if (!e.error) {
        
      }
    })
  };

  const handleFileInputChange = (e) => {

    Papa.parse(e.target.files[0], {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        console.log(results.data);
        setCSVData(results.data);
        const purposes = [];
        results.data.map((d) => {
          if (d.Purpose && !purposes.includes(d.Purpose)) {
            purposes.push(d.Purpose);
          }
        });
        setPurposes(purposes);
        setCSVFile(e.target.files[0]);
      },
    });
  };

  const handleEmailProviderChange = (e) => {
    setEmailProvider(emailMap[e.target.value]);
  };



  return (
    <>
      <Header user={user} />
      <Layout>
        <div>
          <p class="fw-bold fs-4">E-receipt generation and sender app</p>
        </div>

        <div>
          {error !== '' &&
            <div className="alert alert-danger alert-dismissible fade show" role="alert">{error}
              <button type="button" onClick={() => setError('')} class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
          }
        </div>
        <div class="my-3">
          <label for="csvFile" class="form-label">
            Input file receipt CSV
          </label>
          <input
            class="form-control"
            type="file"
            id="csvFile"
            accept=".csv"
            onChange={(r) => handleFileInputChange(r)}
          />
        </div>

        <div class="my-3">
          <label for="email-provider-select">Select Email provider</label>
          <select
            class="form-select"
            id="email-provider-select"
            aria-label="Default select example"
            onChange={(e) => handleEmailProviderChange(e)}
          >
            <option value="0" selected>
              Select email provider (Default: Google SMTP)
            </option>
            <option value="1">Google SMTP</option>
            <option value="2">MailChimp</option>
            <option value="3">SendGrid</option>
          </select>
        </div>

        <div class="my-3">
          {csvFile && <TemplateMapper purposes={purposes} />}
        </div>

        <div>status bar placeholder</div>

        <div>
          <div>Status Box</div>
          <div class="border border-1 border-darkblack rounded p-2 bg-white">
            {numRecordRead && <p>Total records read: {numRecordRead}</p>}
            <p class="row justify-content-between">
              <div class="col">
                {numSuccess && (
                  <span class="text-green fw-bold">
                    Success: {numSuccess}/{numRecordRead}
                  </span>
                )}
              </div>
              <div class="col text-end">
                {numFailures && (
                  <span class="text-red fw-bold">
                    Failures: {numFailures}/{numRecordRead}
                  </span>
                )}
              </div>
            </p>
          </div>
        </div>

        <div class="my-3 text-center">
          <button
            class="w-100 btn btn-primary"
            onClick={() => handleGenerateAndSend()}
          >
            Generate and Send
          </button>
        </div>

        <div class="row justify-contet-between">
          <div class="col">
            <button class="btn btn-outline-secondary">Download receipts</button>
          </div>
          <div class="col">
            <button class="btn btn-outline-secondary">
              Download error file
            </button>
          </div>
          <div class="col">
            <button class="btn btn-outline-secondary">Download log file</button>
          </div>
        </div>

        <div class="row my-3 text-end">
          <div class="col">
            <button class="btn btn-secondary" onClick={() => resetForm()}>
              Reset
            </button>
          </div>
        </div>
      </Layout>
    </>
  );
}
