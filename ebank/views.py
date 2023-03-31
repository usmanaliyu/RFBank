from django.shortcuts import render

# Create your views here.
from django.shortcuts import render,get_object_or_404
from django.contrib import messages


# Create your views here.

def login(request):
    return render(request,'ebank/login.html')

def dashboard(request):
    return render(request,'ebank/dashboard.html')

def myaccounts(request):
    return render(request,'ebank/myaccounts.html')

def accountstatement(request):
    return render(request,'ebank/accountstatement.html')

def rfbtransfer(request):
    return render(request,'ebank/rfbtransfer.html')

def otherbankstransfer(request):
    return render(request,'ebank/otherbankstransfer.html')

def internationaltransfer(request):
    return render(request,'ebank/internationaltransfer.html')

def spendanalysis(request):
    return render(request,'ebank/spendanalysis.html')

def Cheque(request):
    return render(request,'ebank/Cheque.html')

def westernunioun(request):
    return render(request,'ebank/westernunioun.html')

def loansummarry(request):
    return render(request,'ebank/loansummary.html')

def requestloan(request):
    return render(request,'ebank/requestloan.html')

def stopcheque(request):
    return render(request,'ebank/stopcheque.html')

def preconfirmcheque(request):
    return render(request,'ebank/preconfirmcheque.html')

def viewclearingchequedebt(request):
    return render(request,'ebank/viewclearingchequedebt.html')

def Chequedept(request):
    return render(request,'ebank/Chequedept.html')

def requestcheque(request):
    return render(request,'ebank/requestcheque.html')

def cardreward(request):
    return render(request,'ebank/cardreward.html')

def requestcard(request):
    return render(request,'ebank/requestcard.html')

def stopcard(request):
    return render(request,'ebank/stopcard.html')

def selfservice(request):
    return render(request,'ebank/selfservice.html')

def informationupdate(request):
    return render(request,'ebank/informationupdate.html')

def passwordsettings(request):
    return render(request,'ebank/passwordsettings.html')
