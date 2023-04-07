import './theme.css';
import './index.scss';
interface HookProvider {
    children: any;
    network: 'mainnet' | 'testnet';
    colorMode?: 'dark' | 'light';
    api?: 'string';
}
declare const HookProvider: ({ children, network, colorMode, api }: HookProvider) => JSX.Element;
export default HookProvider;
