inp=int(raw_input('enter a number'))
n=inp
while n!=0:
    r=n%10
    sum=r*r*r+sum
    n=n/10
    
if sum==inp:
    print 'The given number is armstrong'
else:
    print 'it is not an Armstrong number'

