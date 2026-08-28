/**
 * Exports an array of complaint records as a downloaded CSV file.
 * Runs entirely client-side (no backend round trip needed to export
 * whatever the user currently has filtered on screen).
 */
export function exportComplaintsToCsv(complaints, filename = 'my-complaints.csv') {
  const headers = [
    'Ticket ID',
    'Category',
    'Sub Category',
    'Problem Title',
    'Location',
    'Priority',
    'Status',
    'Assigned To',
    'Raised On',
    'SLA Deadline',
  ];

  const rows = complaints.map((c) => [
    c.ticketId,
    c.category,
    c.subCategory,
    c.problemTitle,
    `${c.location}${c.room ? ' - ' + c.room : ''}`,
    c.priority,
    c.status,
    c.assignedTo?.name || 'Unassigned',
    new Date(c.createdAt).toLocaleString('en-IN'),
    new Date(new Date(c.createdAt).getTime() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN'),
  ]);

  const escapeCell = (value) => {
    const str = String(value ?? '');
    return /[",\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };

  const csvContent = [headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
