export async function safeFetch(url, options = {}) {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
      const text = await res.text().catch(()=>null);
      throw new Error(`HTTP ${res.status} - ${text || res.statusText}`);
    }
    return res.json ? await res.json() : res;
  } catch (err) {
    // centralize o log (envie a um logger remoto se houver) e lance para o chamador tratar
    // exemplo simples:
    console.warn('Request failed:', url, err);
    throw err;
  }
}
