(() => {
  try {
    const savedTheme = localStorage.getItem('theme')
    if (!savedTheme) {
      localStorage.setItem('theme', 'light')
      document.documentElement.setAttribute('data-theme', 'light')

      const themeColor = document.querySelector('meta[name="theme-color"]')
      if (themeColor) themeColor.setAttribute('content', '#f4f7fb')

      if (window.btf && typeof window.btf.activateLightMode === 'function') {
        window.btf.activateLightMode()
      }
    }
  } catch (error) {
    console.warn('default-light.js failed to apply light theme.', error)
  }
})()
