// Local defaults: open wallpapers directly and disable external services.
try {
  if (!localStorage.getItem('chat-last-room-id') || localStorage.getItem('chat-last-room-id') === 'showcase')
    localStorage.setItem('chat-last-room-id', 'lobby');
  for (const key of ['chat-show-game-channel', 'chat-show-preferred-sites-channel', 'chat-show-live-show-channel'])
    localStorage.setItem(key, '0');
} catch {}
