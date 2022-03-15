import numpy as np
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
from functools import partial
from numba import jit
import math

def get_greyscale_image(image, colour_wts):
    """
    Gets an image and weights of each colour and returns the image in greyscale
    :param image: The original image
    :param colour_wts: the weights of each colour in rgb (ints > 0)
    :returns: the image in greyscale
    """
    
    ###Your code here###
    greyscale_image = np.dot(image[...,:3], colour_wts)    
    ###**************###
    return greyscale_image
    
def reshape_bilinear(image, new_shape):
    """
    Resizes an image to new shape using bilinear interpolation method
    :param image: The original image
    :param new_shape: a (height, width) tuple which is the new shape
    :returns: the image resized to new_shape
    """
    
    in_height, in_width, _ = image.shape
    out_height, out_width = new_shape
    new_image = np.zeros(new_shape)
    
    ###Your code here###
    new_image = np.zeros((out_height,out_width,3))
    
    def get_scaled_param(org, size_in, size_out):
        scaled_org = ((org * size_in) / size_out)
        scaled_org = (min(scaled_org, size_in - 2))
        return scaled_org
    
    scaled_x_grid = [get_scaled_param(x,in_width,out_width) for x in range(out_width)]
    scaled_y_grid = [get_scaled_param(y,in_height,out_height) for y in range(out_height)]
    
    for i in range(out_width):
        for j in range(out_height):
            x = scaled_x_grid[i]
            y = scaled_y_grid[j]
            v1 = image[int(y), int(x), :]
            v2 = image[int(y+1), int(x), :]
            v3 = image[int(y), int(x+1), :]
            v4 = image[int(y+1), int(x+1), :]
            res1 = v1 * (int(x+1) - x) + v2 * (x - int(x))
            res2 = v3 * (int(x+1) - x) + v4 * (x - int(x))
            resFinal = np.array(res1 * (int(y+1)-y) + res2 * (y-int(y)))[:]
            new_image[j][i] = np.array(resFinal)
            
    ###**************####
    return new_image

    
def gradient_magnitude(image, colour_wts):
    """
    Calculates the gradient image of a given image
    :param image: The original image
    :param colour_wts: the weights of each colour in rgb (> 0) 
    :returns: The gradient image
    """
    greyscale = get_greyscale_image(image, colour_wts)
    ###Your code here###
    
    pen_row = greyscale[len(greyscale)-2,:] 
    pen_col = greyscale[:,len(greyscale[0])-2].reshape(len(greyscale),1)
    prep_y = np.vstack((greyscale,pen_row))
    prep_x = np.hstack((greyscale,pen_col))
    
    gradient = np.zeros(greyscale.shape)
    E_horizontal = np.absolute(np.diff(prep_x))
    E_vertical = np.absolute(np.diff(prep_y,axis=0))
    gradient = np.sqrt(np.square(E_horizontal) + np.square(E_vertical**2))

    
    
    
    
    ###**************###
    return gradient
    
def visualise_seams(image, new_shape, carving_scheme, colour):
    """
    Visualises the seams that would be removed when reshaping an image to new image (see example in notebook)
    :param image: The original image
    :param new_shape: a (height, width) tuple which is the new shape
    :param carving_scheme: the carving scheme to be used.
    :param colour: the colour of the seams (an array of size 3)
    :returns: an image where the removed seams have been coloured.
    """
    ###Your code here###
    ###**************###
    return seam_image
    
def reshape_seam_crarving(image, new_shape, carving_scheme):
    """
    Resizes an image to new shape using seam carving
    :param image: The original image
    :param new_shape: a (height, width) tuple which is the new shape
    :param carving_scheme: the carving scheme to be used.
    :returns: the image resized to new_shape
    """
    ###Your code here###
    ###**************###
    return new_image
