const extractErrorMessage = (error) => {
  const data = error?.response?.data.message;
  if (!data) return 'Something went wrong';

  return Object.entries(data)
    .map(([field, messages]) => {
      return `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
    })
    .join('\n');
};

export default extractErrorMessage;