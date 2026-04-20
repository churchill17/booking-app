import LegalForm from "./components/LegalForm.jsx";

export default function LegalInfoPage({ onBack, onSubmit, data, setField }) {
  return <LegalForm onBack={onBack} onSubmit={onSubmit} data={data} setField={setField} />;
}
