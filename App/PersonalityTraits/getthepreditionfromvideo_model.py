from keras.models import load_model
import os
from glob import glob
import numpy as np
from keras.preprocessing import image
from scipy import stats as s
import SplitFrames

# returns a compiled model
# identical to the previous one

model = load_model(os.path.join('model_saved.h5'))
