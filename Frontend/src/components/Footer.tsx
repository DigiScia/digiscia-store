const footerLinks = {
  Boutique: ["Ordinateurs", "Téléphones", "Audio", "Câbles", "Chargeurs"],
  Support: ["FAQ", "Contact", "Livraison", "Retours", "Garantie"],
  Entreprise: ["À propos", "Blog", "Carrières", "Partenaires"],
};

const Footer = () => (
  <footer className="border-t border-border/40 pt-16 pb-8">
    <div className="container mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <img src="/logo.svg" alt="DigiScia Logo" className="h-8 w-auto" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Votre partenaire tech de confiance. Matériel informatique et électronique de qualité.
          </p>
        </div>

        {Object.entries(footerLinks).map(([title, links]) => (
          <div key={title}>
            <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border/40 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 DigiScia Store. Tous droits réservés.
        </p>
        <p className="text-xs text-muted-foreground">
          Développé par <a href="https://digiscia.com" className="text-primary hover:underline">DigiScia</a>
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
