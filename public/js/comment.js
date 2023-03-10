const newFormHandler = async (event) => {
    event.preventDefault();
  
    const body = document.querySelector('#comment-body').value.trim();
    const postUrl = window.location.toString();
    const postId = postUrl.charAt(postUrl.length - 1);
  
    if (body && postId) {
      const response = await fetch(`/api/comments`, {
        method: 'POST',
        body: JSON.stringify({ body, postId }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to create comment');
      }
    }
  };

document.querySelector('.new-comment-form').addEventListener('submit', newFormHandler);