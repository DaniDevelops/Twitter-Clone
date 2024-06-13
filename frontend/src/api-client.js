export async function signupClient(formData) {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
export async function loginClient(formData) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function logOutClient() {
  const res = await fetch("/api/auth/logout", {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getClient() {
  const res = await fetch("/api/auth/me");

  const data = await res.json();
  if (data.message) return null;
  return data;
}
export async function getPosts(URL) {
  const res = await fetch(URL);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
export async function deleteClientPost(post) {
  const res = await fetch(`/api/posts/delete/${post}`, {
    method: "DELETE",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
export async function createClientPost({ text, img }) {
  const res = await fetch("/api/posts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, img }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getClientSuggestedUsers() {
  const res = await fetch("/api/users/suggested");

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function toggleClientFollowing(userId) {
  const res = await fetch(`/api/users/follow/${userId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
export async function toggleClientLikes(postId) {
  const res = await fetch(`/api/posts/like/${postId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
export async function clientCommentPost(postId) {
  const res = await fetch(`/api/posts/comment/${postId}`, {
    method: "POST",
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getClientNotifications() {
  const res = await fetch("/api/notifications/");

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
export async function deleteClientNotifications() {
  const res = await fetch("/api/notifications/", {
    method: "DELETE",
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}

export async function getClientProfile(username) {
  const res = await fetch(`/api/users/profile/${username}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.message);
  return data;
}
