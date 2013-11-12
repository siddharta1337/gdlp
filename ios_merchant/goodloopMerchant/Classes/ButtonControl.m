//
//  ButtonControl.m
//  test
//
//  Created by carlos Solis on 2/26/13.
//  Copyright (c) 2013 carlos Solis. All rights reserved.
//

#import "ButtonControl.h"

@interface ButtonControl()

@property BOOL* flashActivo;
@end


@implementation ButtonControl



- (id)initWithFrame:(CGRect)frame
{
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
        self.flashActivo = NO;
    }
    return self;
}


-(void) awakeFromNib{
    
    // Initialization code
    [self addTarget:self action:@selector(touchUpInside) forControlEvents:UIControlEventTouchUpInside];
    
    [self setTitle:@"flash" forState:UIControlStateNormal];
    
    
    
}

-(void)touchUpInside{
    AVCaptureDevice *device = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeVideo];
    if ([device hasTorch]) {
        
        if(self.flashActivo == NO){
            [device lockForConfiguration:nil];
            [device setTorchMode:AVCaptureTorchModeOn];  // use AVCaptureTorchModeOff to turn off
            [device unlockForConfiguration];
            self.flashActivo = YES;
        }else{
            [device lockForConfiguration:nil];
            [device setTorchMode:AVCaptureTorchModeOff];  // use AVCaptureTorchModeOff to turn off
            [device unlockForConfiguration];
            self.flashActivo = NO;
        }
    }
}

/*
 // Only override drawRect: if you perform custom drawing.
 // An empty implementation adversely affects performance during animation.
 - (void)drawRect:(CGRect)rect
 {
 // Drawing code
 }
 */

@end
