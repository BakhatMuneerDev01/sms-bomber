import { ExternalLink, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-12 pt-8 border-t border-border">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <span>© 2025 SMS Dashboard</span>
          <span>•</span>
          <span>Educational Use Only</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="#terms" 
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Shield className="h-4 w-4" />
            <span>Terms & Conditions</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-muted/50 rounded-lg">
        <p className="text-xs text-muted-foreground text-center">
          <strong>Important:</strong> This tool is for educational and testing purposes only. 
          Please ensure compliance with all applicable telecommunications laws in your jurisdiction.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

