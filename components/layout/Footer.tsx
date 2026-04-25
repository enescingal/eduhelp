export function Footer() {
  return (
    <footer className="border-t mt-12">
      <div className="container mx-auto px-4 py-6 text-xs text-muted-foreground space-y-2">
        <p>
          Bu uygulamada yer alan bilgiler sadece bilgilendirme amaçlıdır. Yanlış veya eksik bilgi
          girişinden kaynaklanan hesaplama hatalarından geliştirici sorumlu değildir. Resmi
          hesaplamalar için kurumunuza danışınız.
        </p>
        <p>
          Veri kaynağı:{" "}
          <a
            href="https://www.ozkansoft.com/eduhep.php"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            ozkansoft.com/eduhep.php
          </a>
        </p>
      </div>
    </footer>
  );
}
