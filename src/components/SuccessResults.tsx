import type { SendResult } from '../types/resident';

interface SuccessResultsProps {
  results: SendResult[];
}

export const SuccessResults = ({ results }: SuccessResultsProps) => {
  return (
    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="text-green-900 font-semibold mb-2 flex items-center">
        <span className="mr-2">✓</span> Message Sent Successfully!
      </h3>
      <div className="space-y-1">
        {results.map((result) => (
          <div key={result.channel} className="text-sm text-green-800">
            <span className="font-medium capitalize">{result.channel}:</span> Sent to{' '}
            {result.recipientCount} recipient{result.recipientCount !== 1 ? 's' : ''}
          </div>
        ))}
      </div>
    </div>
  );
};
