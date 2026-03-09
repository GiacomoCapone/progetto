def controlla_numero(x):
   if x==5:
       raise ValueError("il numero 5 non è permesso")
   return x
 
try:
    n=int(input("inserisci numero"))
    controlla_numero(n)
    print("numero accettato")
except ValueError as e:
    print("errore:", e)