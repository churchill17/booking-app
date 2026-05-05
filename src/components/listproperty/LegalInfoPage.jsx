import LegalForm from "./components/LegalForm.jsx";

export default function LegalInfoPage({ onSubmit, data, setField, isEdit }) {
  return <LegalForm onSubmit={onSubmit} data={data} setField={setField} isEdit={isEdit} />;
}
