outF = open("train_new.csv", "a")

# outF.write("image, class")
# outF.write("\n")

for x in range(26):
    outF.write("\n")
    outF.write("You/You_1_frame"+str(x*3)+".jpg, you")
for x in range(16):
    outF.write("\n")
    outF.write("You/You_2_frame"+str(x*3)+".jpg, you")
for x in range(22):
    outF.write("\n")
    outF.write("You/You_3_frame"+str(x*3)+".jpg, you")
