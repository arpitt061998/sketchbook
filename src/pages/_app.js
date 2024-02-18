import '@/styles/globals.css';
import { Provider } from 'react-redux';
import appStore from '@/utils/appStore';

export default function App({ Component, pageProps }) {
  return (
    <Provider store={appStore}>
      <Component {...pageProps}/>
    </Provider>
  )
}
