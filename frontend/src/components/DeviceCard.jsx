const DeviceCard = ({ device, onToggle, onDelete }) => {
  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{device.name}</h3>
          <p className="text-gray-600">{device.type}</p>
        </div>
        <span
          className={`px-2 py-1 rounded text-sm ${
            device.status === 'on'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {device.status}
        </span>
      </div>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onToggle(device._id)}
          className="btn btn-primary flex-1"
        >
          Toggle
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(device._id)}
            className="btn btn-secondary flex-1"
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default DeviceCard; 