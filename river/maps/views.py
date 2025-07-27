from django.shortcuts import render

def map_view(request):
    return render(request, 'maps/map.html')  # Make sure map.html exists
