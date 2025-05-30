const extractErrorMessage = (error) => {
  const data = error?.response?.data?.message || error?.message;

  if (!data) return 'Something went wrong';

  if (typeof data === 'string') {
    return data;
  }

  return Object.entries(data)
    .map(([field, messages]) => {
      return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
    })
    .join('\n');
};

export default extractErrorMessage;