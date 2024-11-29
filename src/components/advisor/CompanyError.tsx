interface CompanyErrorProps {
  error: Error;
}

const CompanyError = ({ error }: CompanyErrorProps) => (
  <div className="p-4">
    <div className="bg-destructive/15 text-destructive p-4 rounded-lg">
      <h3 className="font-semibold mb-2">Error loading companies</h3>
      <p>{error.message}</p>
    </div>
  </div>
);

export default CompanyError;